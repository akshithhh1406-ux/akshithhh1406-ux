export type UserRole = 'doctor' | 'patient';

export type UserProfile = {
	uid: string;
	role: UserRole;
	displayName?: string | null;
	email?: string | null;
	photoURL?: string | null;
	createdAt?: unknown;
};

export type EncryptedDocument = {
	id?: string;
	ownerId: string;
	name: string;
	size: number;
	contentType: string;
	storageUrl: string;
	encrypted: boolean;
	createdAt?: unknown;
};

export type Doctor = {
	id: string;
	name: string;
	speciality: string;
	about?: string;
	videoUrl?: string;
	createdAt?: unknown;
	updatedAt?: unknown;
};