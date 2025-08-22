"use client";

import { useEffect, useState, useCallback } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { decryptBytes, deriveKeyFromPin, encryptBytes, randomBytes } from '@/lib/crypto';
import { promptBiometricOrPin } from '@/lib/biometric';

export default function DigiLockerPage() {
	const [userId, setUserId] = useState<string | null>(null);
	const [pinSalt, setPinSalt] = useState<Uint8Array | null>(null);
	const [key, setKey] = useState<CryptoKey | null>(null);
	const [files, setFiles] = useState<import('@/types/firestore').EncryptedDocument[]>([]);
	const [unlocking, setUnlocking] = useState(false);

	useEffect(() => auth.onAuthStateChanged((u) => setUserId(u?.uid ?? null)), []);

	useEffect(() => {
		(async () => {
			if (!userId) return;
			// Load or create salt for PIN derivation
			const saltKey = `digilocker_salt_${userId}`;
			let salt = localStorage.getItem(saltKey);
			if (!salt) {
				const s = randomBytes(16);
				const b64 = btoa(String.fromCharCode(...Array.from(s)));
				localStorage.setItem(saltKey, b64);
				salt = b64;
			}
			setPinSalt(Uint8Array.from(atob(salt), (c) => c.charCodeAt(0)));
		})();
	}, [userId]);

	const loadFiles = useCallback(async () => {
		if (!userId) return;
		const q = query(collection(db, 'documents'), where('ownerId', '==', userId));
		const snap = await getDocs(q);
		setFiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as import('@/types/firestore').EncryptedDocument[]);
	}, [userId]);

	useEffect(() => {
		loadFiles();
	}, [loadFiles]);

	const unlock = async () => {
		if (!pinSalt || !userId) return;
		setUnlocking(true);
		const ok = await promptBiometricOrPin(async (pin) => {
			const k = await deriveKeyFromPin(pin, pinSalt);
			setKey(k);
			return true;
		});
		if (!ok) alert('Authentication failed');
		setUnlocking(false);
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!key || !userId || !e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];
		const array = new Uint8Array(await file.arrayBuffer());
		const cipher = await encryptBytes(array, key);
		const storageRef = ref(storage, `documents/${userId}/${Date.now()}_${file.name}.enc`);
		await uploadBytes(storageRef, cipher);
		const url = await getDownloadURL(storageRef);
		await addDoc(collection(db, 'documents'), {
			ownerId: userId,
			name: file.name,
			size: file.size,
			contentType: file.type,
			storageUrl: url,
			encrypted: true,
			createdAt: serverTimestamp(),
		});
		await loadFiles();
	};

	const viewFile = async (docItem: import('@/types/firestore').EncryptedDocument) => {
		if (!key) {
			alert('Unlock DigiLocker first');
			return;
		}
		const res = await fetch(docItem.storageUrl);
		const buf = new Uint8Array(await res.arrayBuffer());
		const plain = await decryptBytes(buf, key);
		const copy = new Uint8Array(plain.byteLength);
		copy.set(plain);
		const blob = new Blob([copy.buffer], { type: docItem.contentType || 'application/octet-stream' });
		const url = URL.createObjectURL(blob);
		window.open(url, '_blank');
	};

	const seedSamples = async () => {
		if (!userId) return;
		// Create a few sample entries pointing to placeholder text
		const samples = [
			{ name: 'Prescription_Sample.pdf', url: 'data:application/pdf;base64,', size: 0, contentType: 'application/pdf' },
			{ name: 'Blood_Test_Report.pdf', url: 'data:application/pdf;base64,', size: 0, contentType: 'application/pdf' },
			{ name: 'XRay_Result.jpg', url: 'data:image/jpeg;base64,', size: 0, contentType: 'image/jpeg' },
		];
		for (const s of samples) {
			await addDoc(collection(db, 'documents'), {
				ownerId: userId,
				name: s.name,
				size: s.size,
				contentType: s.contentType,
				storageUrl: s.url,
				encrypted: false,
				createdAt: serverTimestamp(),
			});
		}
		await loadFiles();
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">Secure DigiLocker</h1>
			<p className="text-sm text-gray-600">Biometric/PIN protected. Your documents are encrypted client-side.</p>
			<div className="flex gap-3">
				<button className="px-3 py-2 border rounded" onClick={unlock} disabled={unlocking}>{unlocking ? 'Unlocking...' : 'Unlock'}</button>
				<label className="px-3 py-2 border rounded cursor-pointer">
					Upload Document
					<input type="file" className="hidden" onChange={handleUpload} />
				</label>
				<button className="px-3 py-2 border rounded" onClick={seedSamples}>Add Sample Docs</button>
			</div>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{files.map((f) => (
					<div key={f.id} className="border rounded p-3">
						<div className="font-medium truncate" title={f.name}>{f.name}</div>
						<div className="text-xs text-gray-500">{f.encrypted ? 'Encrypted' : 'Sample (not encrypted)'}</div>
						<div className="mt-2 flex gap-2">
							<button className="px-2 py-1 border rounded" onClick={() => viewFile(f)}>View</button>
						</div>
					</div>
				))}
			</div>
			<p className="text-xs text-gray-500">
				Grant access to doctors and health department after booking online consultancy. Records from other doctors are saved here.
			</p>
		</div>
	);
}