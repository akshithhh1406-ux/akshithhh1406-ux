import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.text();
	let messages: { role: 'user' | 'assistant'; content: string }[] = [];
	try {
		const j = JSON.parse(body);
		messages = j.messages || [];
	} catch {}
	const last = messages[messages.length - 1]?.content?.toLowerCase?.() || '';
	const key = process.env.OPENAI_API_KEY;
	if (key) {
		try {
			const response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
				body: JSON.stringify({
					model: 'gpt-4o-mini',
					messages: [
						{ role: 'system', content: 'You are a cautious healthcare assistant for Nashik users. Provide multilingual-friendly, basic guidance with disclaimers. Avoid diagnosis. Encourage hospital visit for emergencies.' },
						...messages,
					],
					temperature: 0.3,
				}),
			});
			const data = await response.json();
			const reply = data.choices?.[0]?.message?.content || 'Please consult a doctor for a proper evaluation.';
			return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } });
		} catch {}
	}
	// Fallback simple rules
	let reply = 'Consider rest, hydration, and over-the-counter pain relief if appropriate. If symptoms worsen or include chest pain, breathlessness, or severe weakness, go to the nearest hospital immediately.';
	if (last.includes('fever')) reply = 'Monitor temperature, hydrate, and consider paracetamol as per label. If high fever (>39C), rash, stiff neck, or confusion, seek immediate care.';
	if (last.includes('diabetes') || last.includes('sugar')) reply = 'Maintain balanced meals, monitor blood sugar, avoid refined carbs. For hypoglycemia: 15g fast-acting carbs, recheck in 15 minutes.';
	return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } });
}