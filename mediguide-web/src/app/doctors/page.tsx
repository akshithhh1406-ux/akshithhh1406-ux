"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

export default function DoctorsPage() {
	const [role, setRole] = useState<'doctor' | 'patient' | ''>('');
	const [doctors, setDoctors] = useState<import('@/types/firestore').Doctor[]>([]);
	useEffect(() => auth.onAuthStateChanged(async (u) => {
		if (!u) return;
		const snap = await getDoc(doc(db, 'profiles', u.uid));
		const r = snap.data()?.role as 'doctor' | 'patient' | undefined;
		setRole(r ?? '');
	}), []);

	useEffect(() => {
		(async () => {
			const q = query(collection(db, 'doctors'), orderBy('createdAt', 'desc'));
			const snap = await getDocs(q);
			setDoctors(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as import('@/types/firestore').Doctor[]);
		})();
	}, []);

	return (
		<div className="p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Doctors</h1>
				{role === 'doctor' && (<Link className="px-3 py-2 border rounded" href="/doctors/onboard">List Myself</Link>)}
			</div>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{doctors.map((d) => (
					<div key={d.id} className="border rounded p-4 space-y-2">
						<div className="font-medium">{d.name}</div>
						<div className="text-sm text-gray-600">{d.speciality}</div>
						{d.videoUrl && (
							<video className="w-full rounded" controls src={d.videoUrl} />
						)}
						<Link className="px-3 py-1 border rounded inline-block" href={`/doctors/${d.id}`}>View Profile / Book</Link>
					</div>
				))}
			</div>
		</div>
	);
}