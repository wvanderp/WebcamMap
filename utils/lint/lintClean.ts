/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { Webcam } from '../../src/types/webcam';

const webcamPath = path.join(__dirname, '../../data', './webcams.json');

// clean out empty lint objects
export default function lintClean() {
    console.log('cleaning lint objects');

    const webcams = JSON.parse(fs.readFileSync(webcamPath).toString()) as Webcam[];

    for (const webcam of webcams) {
        if (webcam.lint && Object.keys(webcam.lint).length === 0) {
            delete webcam.lint;
        }
    }

    fs.writeFileSync(webcamPath, JSON.stringify(webcams, null, 2));
}
