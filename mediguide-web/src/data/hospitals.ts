export type Hospital = { id: string; name: string; lat: number; lng: number; phone?: string; address?: string };

export const NASHIK_HOSPITALS: Hospital[] = [
	{ id: 'nh1', name: 'Deenanath Mangeshkar Hospital Nashik Unit', lat: 19.9975, lng: 73.7898, phone: '+912532000000', address: 'Central Nashik' },
	{ id: 'nh2', name: 'Wockhardt Hospitals, Nashik', lat: 20.0115, lng: 73.7901, phone: '+912532230400', address: 'Mumbai Naka' },
	{ id: 'nh3', name: 'Apollo Hospital Nashik', lat: 20.0052, lng: 73.7769, phone: '+912532222222', address: 'College Road' },
	{ id: 'nh4', name: 'Suyash Hospital', lat: 19.9822, lng: 73.7758, phone: '+912532570000', address: 'Gangapur Road' },
	{ id: 'nh5', name: 'Ashoka Medicover Hospital', lat: 20.0009, lng: 73.7765, phone: '+912532300000', address: 'Near Ashoka Marg' },
];