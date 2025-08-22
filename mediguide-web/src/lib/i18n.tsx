"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type Lang = 'en' | 'mr' | 'hi' | 'ta' | 'te';

type Dictionary = Record<string, string>;

const dictionaries: Record<Lang, Dictionary> = {
	en: {
		appName: 'MediGuide: Nashik',
		signIn: 'Sign In',
		dashboard: 'Dashboard',
		digilocker: 'Secure DigiLocker',
		doctors: 'Doctors',
		assistant: 'AI Health Assistant',
		nutrition: 'Nutrition Guide',
		hospitals: 'Hospital Map',
		sos: 'Emergency SOS',
		schemes: 'Government Schemes',
	},
	mr: {
		appName: 'मेडीगाईड: नाशिक',
		signIn: 'साइन इन',
		dashboard: 'डॅशबोर्ड',
		digilocker: 'सिक्योर डीजीलॉकर',
		doctors: 'डॉक्टर्स',
		assistant: 'एआय हेल्थ असिस्टंट',
		nutrition: 'पोषण मार्गदर्शक',
		hospitals: 'रुग्णालय नकाशा',
		sos: 'आपत्कालीन एसओएस',
		schemes: 'शासकीय योजना',
	},
	hi: {
		appName: 'मेडीगाइड: नाशिक',
		signIn: 'साइन इन',
		dashboard: 'डैशबोर्ड',
		digilocker: 'सुरक्षित डीजिलॉकर',
		doctors: 'डॉक्टर्स',
		assistant: 'एआई हेल्थ असिस्टेंट',
		nutrition: 'पोषण गाइड',
		hospitals: 'हॉस्पिटल मानचित्र',
		sos: 'आपातकालीन SOS',
		schemes: 'सरकारी योजनाएं',
	},
	ta: {
		appName: 'மெடிகைடு: நாசிக்',
		signIn: 'உள் நுழை',
		dashboard: 'டாஷ்போர்டு',
		digilocker: 'பாதுகாப்பான டிஜிலாக்கர்',
		doctors: 'மருத்துவர்கள்',
		assistant: 'ஏஐ ஆரோக்கிய உதவியாளர்',
		nutrition: 'ஆஹார வழிகாட்டி',
		hospitals: 'மருத்துவமனை வரைபடம்',
		sos: 'அவசரகால SOS',
		schemes: 'அரசுத் திட்டங்கள்',
	},
	te: {
		appName: 'మెడిగైడ్: నాసిక్',
		signIn: 'సైన్ ఇన్',
		dashboard: 'డాష్‌బోర్డ్',
		digilocker: 'సురక్షిత డిజిలోకర్',
		doctors: 'వైద్యులు',
		assistant: 'ఏఐ హెల్త్ అసిస్టెంట్',
		nutrition: 'పోషకాహార మార్గదర్శక',
		hospitals: 'హాస్పిటల్ మ్యాప్',
		sos: 'ఎమర్జెన్సీ SOS',
		schemes: 'ప్రభుత్వ పథకాలు',
	},
};

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string } | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
	const [lang, setLang] = useState<Lang>('en');
	const t = useMemo(() => {
		const dict = dictionaries[lang];
		return (key: string) => dict[key] ?? key;
	}, [lang]);
	return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error('useI18n must be used within I18nProvider');
	return ctx;
}