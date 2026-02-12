// https://stackoverflow.com/a/49479872
export default function getRandom<T>(items: T[], n: number): T[] {
	return items
		.map((x) => ({ x, r: Math.random() }))
		.sort((a, b) => a.r - b.r)
		.map((a) => a.x)
		.slice(0, n);
}
