"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
	const [role, setRole] = useState<'doctor' | 'patient' | ''>('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const unsub = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const profileRef = doc(db, 'profiles', user.uid);
				const snap = await getDoc(profileRef);
				if (snap.exists()) {
					router.replace('/dashboard');
				}
			}
		});
		return () => unsub();
	}, [router]);

	const handleGoogleSignIn = async () => {
		try {
			setLoading(true);
			const provider = new GoogleAuthProvider();
			const res = await signInWithPopup(auth, provider);
			const user = res.user;
			if (!user) return;
			if (!role) {
				alert('Please select role: Doctor or Patient');
				await signOut(auth);
				return;
			}
			await setDoc(
				doc(db, 'profiles', user.uid),
				{
					uid: user.uid,
					role,
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					createdAt: serverTimestamp(),
				},
				{ merge: true }
			);
			router.replace('/dashboard');
		} catch (e) {
			console.error(e);
			alert('Sign-in failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-md space-y-6">
				<h1 className="text-2xl font-semibold text-center">MediGuide Nashik</h1>
				<div className="space-y-2">
					<label className="block text-sm font-medium">Sign up as</label>
					<div className="flex gap-3">
						<button
							className={`px-4 py-2 rounded border ${role === 'doctor' ? 'bg-blue-600 text-white' : ''}`}
							onClick={() => setRole('doctor')}
						>
							Doctor
						</button>
						<button
							className={`px-4 py-2 rounded border ${role === 'patient' ? 'bg-blue-600 text-white' : ''}`}
							onClick={() => setRole('patient')}
						>
							Patient
						</button>
					</div>
				</div>
				<button
					className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
					onClick={handleGoogleSignIn}
					disabled={loading}
				>
					{loading ? 'Signing in...' : 'Continue with Google'}
				</button>
				<p className="text-xs text-center text-gray-500">
					By continuing you agree to our terms and acknowledge this prototype is for demo purposes only.
				</p>
				<p className="text-center">
					<Link className="text-blue-600" href="/">Back to Home</Link>
				</p>
			</div>
		</div>
	);
}