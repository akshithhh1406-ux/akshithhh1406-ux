"use client";

import { useEffect, useState } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function UploadVideoPage() {
	const [userId, setUserId] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const router = useRouter();

	useEffect(() => auth.onAuthStateChanged((u) => setUserId(u?.uid ?? null)), []);
	useEffect(() => {
		(async () => {
			if (!userId) return;
			const p = await getDoc(doc(db, 'profiles', userId));
			if ((p.data()?.role as 'doctor' | 'patient' | undefined) !== 'doctor') {
				alert('Only doctors can upload video');
				router.replace('/dashboard');
			}
		})();
	}, [userId, router]);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!userId || !e.target.files || e.target.files.length === 0) return;
		setUploading(true);
		const file = e.target.files[0];
		const r = ref(storage, `doctor_videos/${userId}/${Date.now()}_${file.name}`);
		await uploadBytes(r, file);
		const url = await getDownloadURL(r);
		await setDoc(doc(db, 'doctors', userId), { videoUrl: url, updatedAt: serverTimestamp() }, { merge: true });
		alert('Video uploaded');
		router.replace('/doctors');
		setUploading(false);
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">Upload Intro Video</h1>
			<label className="px-3 py-2 border rounded inline-block cursor-pointer">
				{uploading ? 'Uploading...' : 'Choose Video'}
				<input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
			</label>
		</div>
	);
}