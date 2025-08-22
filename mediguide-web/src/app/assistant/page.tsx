"use client";

import { useState } from 'react';

export default function AssistantPage() {
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
		{ role: 'assistant', content: 'I can help with symptom analysis, first-aid, and wellness tips. For critical emergencies, visit hospitals immediately.' },
	]);

	const send = async () => {
		if (!input.trim()) return;
		const userMessage = { role: 'user' as const, content: input };
		setMessages((m) => [...m, userMessage]);
		setInput('');
		const res = await fetch('/api/assistant', { method: 'POST', body: JSON.stringify({ messages: [...messages, userMessage] }) });
		const data = await res.json();
		setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">AI Health Assistant</h1>
			<div className="rounded border p-3 bg-red-50">
				<strong>Emergencies:</strong> Chest pain, severe bleeding, stroke signs, severe burns, unconsciousness, major accidents. Call nearest hospital or use SOS.
				<div className="text-xs">Disclaimer: Not medical advice. For critical emergencies, visit hospitals immediately.</div>
			</div>
			<div className="rounded border p-3 bg-green-50">
				<strong>Wellness:</strong> Hydration, 7-8h sleep, daily 30min walk, avoid tobacco, manage stress.
			</div>
			<div className="space-y-3">
				<div className="border rounded p-3 h-80 overflow-auto bg-white">
					{messages.map((m, i) => (
						<div key={i} className={m.role === 'assistant' ? 'text-blue-800' : 'text-gray-800'}>
							<strong>{m.role === 'assistant' ? 'Assistant' : 'You'}:</strong> {m.content}
						</div>
					))}
				</div>
				<div className="flex gap-2">
					<input className="flex-1 border rounded px-3 py-2" placeholder="Ask about symptoms or first-aid..." value={input} onChange={(e) => setInput(e.target.value)} />
					<button className="px-3 py-2 border rounded" onClick={send}>Send</button>
				</div>
			</div>
		</div>
	);
}