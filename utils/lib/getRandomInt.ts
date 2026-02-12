export default function getRandomInt(min: number, max: number): number {
	const roundedMin = Math.ceil(min);
	const RoundedMax = Math.floor(max);
	return Math.floor(Math.random() * (RoundedMax - roundedMin + 1)) + roundedMin;
}
