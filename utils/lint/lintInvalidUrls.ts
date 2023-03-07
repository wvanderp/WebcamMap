/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import { Webcam } from '../../src/types/webcam';

const webcamPath = path.join(__dirname, '../../data', './webcams.json');

// mark links invalid if they are not valid urls
export default function lintInvalidUrls() {
    const webcams = JSON.parse(fs.readFileSync(webcamPath).toString()) as Webcam[];

    const invalidUrls: Webcam[] = [];

    for (const webcam of webcams) {
        if (webcam.url.length === 0) {
            console.log(`Webcam ${webcam.osmID} has no url`);
            invalidUrls.push(webcam);
        }

        try {
            // eslint-disable-next-line compat/compat, no-new
            new URL(webcam.url);
        } catch {
            console.log(`Webcam ${webcam.osmID} has an invalid url: ${webcam.url}`);
            invalidUrls.push(webcam);
        }
    }

    for (const webcam of invalidUrls) {
        webcam.lint = {
            ...webcam.lint,
            invalidUrl: true
        };
    }

    fs.writeFileSync(webcamPath, JSON.stringify(webcams, null, 2));
}
