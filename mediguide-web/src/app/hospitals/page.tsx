"use client";

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { NASHIK_HOSPITALS } from '@/data/hospitals';

const containerStyle = { width: '100%', height: '400px' } as const;

export default function HospitalsPage() {
	const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });
	const center = useMemo(() => ({ lat: 19.9975, lng: 73.7898 }), []);
	const [selected, setSelected] = useState(NASHIK_HOSPITALS[0]);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">Hospital Map</h1>
			{isLoaded && (
				<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
					{NASHIK_HOSPITALS.map((h) => (
						<Marker key={h.id} position={{ lat: h.lat, lng: h.lng }} onClick={() => setSelected(h)} />
					))}
				</GoogleMap>
			)}
			<div className="grid md:grid-cols-2 gap-4">
				<div className="border rounded p-4">
					<h2 className="font-medium">Nashik Hospitals</h2>
					<ul className="divide-y">
						{NASHIK_HOSPITALS.map((h) => (
							<li key={h.id} className="py-2 flex items-center justify-between">
								<div>
									<div className="font-medium">{h.name}</div>
									<div className="text-xs text-gray-600">{h.address}</div>
									<div className="text-xs">{h.phone}</div>
								</div>
								<a className="px-2 py-1 border rounded" target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}>Directions</a>
							</li>
						))}
					</ul>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium">Mini Map: Nearby</h2>
					<div className="text-xs text-gray-600 mb-2">Selected: {selected?.name}</div>
					{isLoaded && (
						<GoogleMap mapContainerStyle={{ width: '100%', height: '250px' }} center={{ lat: selected.lat, lng: selected.lng }} zoom={14}>
							<Marker position={{ lat: selected.lat, lng: selected.lng }} />
						</GoogleMap>
					)}
				</div>
			</div>
		</div>
	);
}