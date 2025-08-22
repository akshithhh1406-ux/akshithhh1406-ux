export async function deriveKeyFromPin(pin: string, salt: Uint8Array): Promise<CryptoKey> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
	const saltAb = toArrayBuffer(salt);
	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: saltAb as ArrayBuffer,
			iterations: 100_000,
			hash: 'SHA-256',
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

export function randomBytes(length: number): Uint8Array {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return bytes;
}

export async function encryptBytes(data: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
	const iv = randomBytes(12);
	const ivAb = toArrayBuffer(iv);
	const dataAb = toArrayBuffer(data);
	const enc = (await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivAb }, key, dataAb)) as ArrayBuffer;
	const cipher = new Uint8Array(enc);
	const out = new Uint8Array(12 + cipher.length);
	out.set(iv, 0);
	out.set(cipher, 12);
	return out;
}

export async function decryptBytes(cipherWithIv: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
	const iv = cipherWithIv.slice(0, 12);
	const cipher = cipherWithIv.slice(12);
	const ivAb = toArrayBuffer(iv);
	const cipherAb = toArrayBuffer(cipher);
	const plain = (await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivAb }, key, cipherAb)) as ArrayBuffer;
	return new Uint8Array(plain);
}

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
	const ab = new ArrayBuffer(u8.byteLength);
	new Uint8Array(ab).set(u8);
	return ab;
}