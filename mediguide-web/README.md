# MediGuide: Nashik (Web Prototype)

A multilingual healthcare prototype built with Next.js and Firebase.

Features (prototype):
- Firebase Auth with role selection (Doctor/Patient), persistent sessions
- Secure DigiLocker: client-side AES-GCM encryption, biometric/PIN gate, sample docs
- Doctors: list/self-onboard (doctor role), upload intro video, patient view, book consult via Jitsi link
- AI Health Assistant: emergencies, wellness, illness chat (OpenAI API if configured)
- Nutrition Guide: condition-based static plans
- Hospital Map: Nashik hospitals, Google Maps, directions, mini map
- Emergency SOS: nearest hospital call, record/share voice note, services list
- Government Schemes: Coming Soon banner

Quickstart
1. Copy env template and fill values
```bash
cp .env.local.example .env.local
```
2. Install deps and run dev server
```bash
npm install
npm run dev
```
3. Configure Firebase web app and Firestore rules suitable for a prototype.

Environment variables
- Firebase: NEXT_PUBLIC_FIREBASE_*
- Maps: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- OpenAI: OPENAI_API_KEY (optional)

Notes
- This is a demo. Do not use for real medical decisions.
- DigiLocker encryption is client-only; keys derived from a local PIN; no server key escrow.
