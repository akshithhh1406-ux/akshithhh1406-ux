export default function NutritionPage() {
	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">Nutrition Guide</h1>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="border rounded p-4">
					<h2 className="font-medium">Diabetes</h2>
					<ul className="list-disc ml-5 text-sm">
						<li>Plate method: half vegetables, quarter lean protein, quarter whole grains</li>
						<li>Avoid refined sugars; prefer low GI fruits in moderation</li>
						<li>Regular meal timings; hydrate adequately</li>
					</ul>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium">Hypertension</h2>
					<ul className="list-disc ml-5 text-sm">
						<li>DASH diet: low sodium, rich in fruits, veg, whole grains</li>
						<li>Limit processed foods and salty snacks</li>
						<li>Monitor BP and maintain healthy weight</li>
					</ul>
				</div>
				<div className="border rounded p-4">
					<h2 className="font-medium">Post-Surgery Recovery</h2>
					<ul className="list-disc ml-5 text-sm">
						<li>High-protein meals; vitamin C and zinc for wound healing</li>
						<li>Soft, easy-to-digest foods initially; gradual progression</li>
						<li>Hydration and fiber to prevent constipation</li>
					</ul>
				</div>
			</div>
			<p className="text-xs text-gray-500">Personalized plans can be generated via AI in a future iteration.</p>
		</div>
	);
}