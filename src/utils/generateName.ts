import { Webcam } from '../types/webcam';

function typeBased(webcam: Webcam): string | undefined {
	switch (webcam.osmTags.surveillance) {
		case 'traffic': {
			return 'Unknown Traffic Camera';
		}
		case 'webcam': {
			return 'Unknown Webcam';
		}
		default: {
			return undefined;
		}
	}
}

export default function generateName(webcam: Webcam): string {
	return webcam.osmTags.name ?? webcam.operator ?? webcam.osmTags.description ?? typeBased(webcam) ?? 'Unknown';
}
