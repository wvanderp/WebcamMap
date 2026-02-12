import fs from 'fs';
import path from 'path';

import lint404 from './lint404';
import lintClean from './lintClean';
import lintDuplicates from './lintDuplicates';
import lintInvalidUrls from './lintInvalidUrls';
import lintYoutube from './youtubeLint';
import { Webcam } from '../../src/types/webcam';

// There are two parts to this linting process:
// 1. checking the format of the data
// 2. checking the data itself

const webcamPath = path.join(__dirname, '../../data', './webcams.json');

(async () => {
	// format checking
	const webcams = JSON.parse(fs.readFileSync(webcamPath).toString()) as Webcam[];

	if (webcams.length === 0) {
		throw new Error('webcams.json is empty');
	}

	// data checking
	await lintYoutube();
	await lint404();
	lintDuplicates();
	lintInvalidUrls();

	lintClean();
})().catch((error) => { throw error; });
