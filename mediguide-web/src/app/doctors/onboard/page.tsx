"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function OnboardDoctorPage() {
	const [name, setName] = useState('');
	const [speciality, setSpeciality] = useState('General Physician');
	const [about, setAbout] = useState('');
	const [userId, setUserId] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => auth.onAuthStateChanged((u) => setUserId(u?.uid ?? null)), []);
	useEffect(() => {
		(async () => {
			if (!userId) return;
			const p = await getDoc(doc(db, 'profiles', userId));
			if ((p.data()?.role as 'doctor' | 'patient' | undefined) !== 'doctor') {
				alert('Only doctors can list themselves');
				router.replace('/dashboard');
			}
		})();
	}, [userId, router]);

	const submit = async () => {
		if (!userId) return;
		await setDoc(doc(db, 'doctors', userId), {
			id: userId,
			name,
			speciality,
			about,
			createdAt: serverTimestamp(),
		});
		alert('Listed successfully');
		router.replace('/doctors');
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">List Myself as Doctor</h1>
			<input className="border rounded px-3 py-2 w-full" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
			<input className="border rounded px-3 py-2 w-full" placeholder="Speciality" value={speciality} onChange={(e) => setSpeciality(e.target.value)} />
			<textarea className="border rounded px-3 py-2 w-full" placeholder="About" value={about} onChange={(e) => setAbout(e.target.value)} />
			<button className="px-3 py-2 border rounded" onClick={submit}>Save</button>
		</div>
	);
}