import { Webcam } from '../types/webcam';

export default function generateName(webcam: Webcam): string {
    return webcam.osmTags.name ?? webcam.operator ?? webcam.osmTags.description ?? 'Unknown';
}
