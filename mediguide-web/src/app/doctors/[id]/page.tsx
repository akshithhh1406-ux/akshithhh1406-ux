"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function DoctorProfilePage() {
	const params = useParams();
	const id = params?.id as string;
	const [doctor, setDoctor] = useState<import('@/types/firestore').Doctor | null>(null);

	useEffect(() => {
		(async () => {
			if (!id) return;
			const snap = await getDoc(doc(db, 'doctors', id));
			setDoctor(snap.data() as import('@/types/firestore').Doctor);
		})();
	}, [id]);

	if (!doctor) return <div className="p-6">Loading...</div>;
	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">{doctor.name}</h1>
			<div className="text-sm text-gray-600">{doctor.speciality}</div>
			{doctor.videoUrl && (<video className="w-full max-w-xl rounded" controls src={doctor.videoUrl} />)}
			<div className="space-y-2">
				<h2 className="font-medium">Book Consultancy</h2>
				<p className="text-sm text-gray-600">Prototype: use the video link below for a sample live consult.</p>
				<a className="px-3 py-2 border rounded inline-block" target="_blank" href={`https://meet.jit.si/${encodeURIComponent('MediGuide-Nashik-' + doctor.id)}`}>Join Video Consult</a>
			</div>
		</div>
	);
}