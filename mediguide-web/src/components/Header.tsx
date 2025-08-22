"use client";

import Link from 'next/link';
import { useI18n, type Lang } from '@/lib/i18n';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';

export default function Header() {
	const { lang, setLang, t } = useI18n();
	const [user, setUser] = useState<import('firebase/auth').User | null>(null);
	useEffect(() => auth.onAuthStateChanged(setUser), []);
	return (
		<header className="flex items-center justify-between p-4 border-b">
			<Link href="/" className="font-semibold">{t('appName')}</Link>
			<div className="flex items-center gap-3">
				<select className="border rounded px-2 py-1" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
					<option value="en">EN</option>
					<option value="mr">MR</option>
					<option value="hi">HI</option>
					<option value="ta">TA</option>
					<option value="te">TE</option>
				</select>
				{user ? (
					<>
						<Link className="px-3 py-1 border rounded" href="/dashboard">{t('dashboard')}</Link>
						<button className="px-3 py-1 border rounded" onClick={() => signOut(auth)}>Sign out</button>
					</>
				) : (
					<Link className="px-3 py-1 border rounded" href="/(auth)/signin">{t('signIn')}</Link>
				)}
			</div>
		</header>
	);
}