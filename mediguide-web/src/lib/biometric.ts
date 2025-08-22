export async function promptBiometricOrPin(pinCheck: (pin: string) => Promise<boolean>): Promise<boolean> {
	try {
		if (window.PublicKeyCredential) {
			// Dummy WebAuthn get to trigger biometric prompt on supported devices
			// This does not verify on server in this prototype
			const cred = navigator.credentials;
			if (cred) {
				await cred.get({
					publicKey: {
						challenge: new Uint8Array([1, 2, 3, 4]),
						timeout: 60000,
						userVerification: 'preferred',
					},
				});
			}
			return true;
		}
	} catch {}
	const pin = prompt('Enter your DigiLocker PIN');
	if (!pin) return false;
	return pinCheck(pin);
}