"use client";

import { useEffect, useRef, useState } from 'react';
import { NASHIK_HOSPITALS } from '@/data/hospitals';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
	const R = 6371e3;
	const toRad = (d: number) => (d * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export default function SOSPage() {
	const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
	const [nearest, setNearest] = useState<typeof NASHIK_HOSPITALS[number] | null>(null);
	const [recording, setRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((pos) => {
			const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
			setPosition(p);
			let closest = NASHIK_HOSPITALS[0];
			let best = Infinity;
			for (const h of NASHIK_HOSPITALS) {
				const dist = haversine(p.lat, p.lng, h.lat, h.lng);
				if (dist < best) {
					best = dist;
					closest = h;
				}
			}
			setNearest(closest);
		});
	}, []);

	const callNearest = () => {
		if (!nearest) return;
		window.location.href = `tel:${nearest.phone?.replace(/\s/g, '') || ''}`;
	};

	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const mr = new MediaRecorder(stream);
		mediaRecorderRef.current = mr;
		chunksRef.current = [];
		mr.ondataavailable = (e) => chunksRef.current.push(e.data);
		mr.onstop = () => {
			const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
			const url = URL.createObjectURL(blob);
			const shareText = `SOS voice note. Location: ${position?.lat},${position?.lng}`;
			const nav = navigator as Navigator & { share?: (data: { title?: string; text?: string; url?: string }) => Promise<void> };
			if (nav.share) {
				nav.share({ title: 'SOS Voice', text: shareText, url });
			} else {
				window.open(url, '_blank');
			}
		};
		mr.start();
		setRecording(true);
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
		setRecording(false);
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">Emergency SOS</h1>
			<p className="text-sm text-gray-600">Immediate connection to the nearest hospital. For critical emergencies, visit hospitals immediately.</p>
			<div className="flex gap-3">
				<button className="px-6 py-3 rounded bg-red-600 text-white" onClick={callNearest}>SOS: Call Nearest Hospital</button>
				{!recording ? (
					<button className="px-3 py-2 border rounded" onClick={startRecording}>Record Voice Message</button>
				) : (
					<button className="px-3 py-2 border rounded" onClick={stopRecording}>Stop & Share</button>
				)}
			</div>
			<div className="grid md:grid-cols-3 gap-4">
				<div className="border rounded p-3">
					<h2 className="font-medium">Services</h2>
					<ul className="list-disc ml-5 text-sm">
						<li>Police: 100</li>
						<li>Ambulance (108)</li>
						<li>Fire: 101</li>
						<li>Women Helpline: 1091</li>
					</ul>
				</div>
				<div className="border rounded p-3">
					<h2 className="font-medium">Nearest Hospital</h2>
					{nearest ? (
						<div>
							<div className="font-medium">{nearest.name}</div>
							<div className="text-xs">{nearest.address}</div>
							<div className="text-xs">{nearest.phone}</div>
							<a className="px-2 py-1 border rounded inline-block mt-2" target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lng}`}>Navigate</a>
						</div>
					) : (
						<div>Locating...</div>
					)}
				</div>
				<div className="border rounded p-3 bg-yellow-50">
					<strong>Disclaimer:</strong> Prototype feature. Always prefer professional medical care immediately for emergencies.
				</div>
			</div>
		</div>
	);
}