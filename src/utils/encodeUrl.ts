export function encodeUrl(url: string): string {
	return encodeURIComponent(url.replaceAll(' ', '_'));
}

export function decodeUrl(url: string): string {
	return decodeURIComponent(url.replaceAll('_', ' '));
}
