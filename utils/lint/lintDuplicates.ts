import fs from 'fs';
import path from 'path';
import { Webcam } from '../../src/types/webcam';

const webcamPath = path.join(__dirname, '../../data', './webcams.json');

// finds duplicate links in the webcams.json file
export default function lintDuplicates() {
	// eslint-disable-next-line no-console
	console.log('linting duplicates');
	const webcams = JSON.parse(
		fs.readFileSync(webcamPath).toString()
	) as Webcam[];

	const duplicates = webcams.filter(
		(w) => webcams.some((o) => o.url === w.url && o.osmID !== w.osmID)
	);

	for (const d of duplicates) {
		d.lint = {
			...d.lint,
			duplicate: true
		};
	}

	fs.writeFileSync(webcamPath, JSON.stringify(webcams, null, 2));
}
