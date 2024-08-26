import teaserfps0 from '$lib/assets/midjourney/teaser-fps-0.png';
import teaserfps1 from '$lib/assets/midjourney/teaser-fps-1.png';
import teaserracefun0 from '$lib/assets/midjourney/teaser-race-fun-0.png';
import teaserracefun1 from '$lib/assets/midjourney/teaser-race-fun-1.png';
import teaserracefun2 from '$lib/assets/midjourney/teaser-race-fun-2.png';
import teaserseabattle0 from '$lib/assets/midjourney/teaser-sea-battle-0.png';
import teaserskate0 from '$lib/assets/midjourney/teaser-skate-0.png';
import teaserspacestrategy0 from '$lib/assets/midjourney/teaser-space-strategy-0.png';

export const placeholders = {
	teasers: [
		teaserfps0,
		teaserracefun0,
		teaserspacestrategy0,
		teaserskate0,
		teaserracefun1,
		teaserfps1,
		teaserracefun2,
		teaserseabattle0,
	]
};

export function randomImages(kind: string, count: number): { src: string; alt: string }[] {
	const sources = placeholders[kind];
	if (!sources) {
		throw new Error(`Unknown placeholder kind: ${kind}`);
	}
	const selected = new Set<string>();

	while (selected.size < count && selected.size < sources.length) {
		const randomItem = sources[Math.floor(Math.random() * sources.length)];
		selected.add(randomItem);
	}

	const items: { src: string; alt: string }[] = [];

	for (const src of Array.from(selected)) {
		items.push({ src, alt: src.substring(src.lastIndexOf('/')) });
	}
	return items;
}
