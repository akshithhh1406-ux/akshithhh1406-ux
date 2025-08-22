"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
	const [role, setRole] = useState<'doctor' | 'patient' | ''>('');
	const router = useRouter();

	useEffect(() => {
		const unsub = auth.onAuthStateChanged(async (user) => {
			if (!user) {
				router.replace('/(auth)/signin');
				return;
			}
			const snap = await getDoc(doc(db, 'profiles', user.uid));
			const r = snap.data()?.role as 'doctor' | 'patient' | undefined;
			setRole(r ?? '');
		});
		return () => unsub();
	}, [router]);

	const handleSignOut = async () => {
		await signOut(auth);
		router.replace('/');
	};

	return (
		<div className="min-h-screen p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Dashboard</h1>
				<button onClick={handleSignOut} className="px-3 py-1 border rounded">Sign out</button>
			</div>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Link className="border rounded p-4 hover:bg-gray-50" href="/digilocker">Secure DigiLocker</Link>
				<Link className="border rounded p-4 hover:bg-gray-50" href="/doctors">Doctors</Link>
				<Link className="border rounded p-4 hover:bg-gray-50" href="/assistant">AI Health Assistant</Link>
				<Link className="border rounded p-4 hover:bg-gray-50" href="/nutrition">Nutrition Guide</Link>
				<Link className="border rounded p-4 hover:bg-gray-50" href="/hospitals">Hospital Map</Link>
				<Link className="border rounded p-4 hover:bg-gray-50" href="/sos">Emergency SOS</Link>
				<Link className="border rounded p-4 hover:bg-gray-50" href="/schemes">Govt. Schemes</Link>
			</div>
			{role === 'doctor' && (
				<div className="rounded border p-4">
					<h2 className="font-medium mb-2">Doctor Tools</h2>
					<div className="flex gap-3 flex-wrap">
						<Link className="px-3 py-2 border rounded" href="/doctors/onboard">List Myself</Link>
						<Link className="px-3 py-2 border rounded" href="/doctors/upload-video">Upload Intro Video</Link>
					</div>
				</div>
			)}
		</div>
	);
}