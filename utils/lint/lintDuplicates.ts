/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import data from '../../data/webcams.json';
import { Webcam } from '../../src/types/webcam';

// finds duplicate links in the webcams.json file
export default function lintDuplicates() {
    console.log('linting duplicates');
    const webcams = data as Webcam[];

    const duplicates = webcams.filter((w) => webcams.some((o) => o.url === w.url && o.osmID !== w.osmID));

    for (const d of duplicates) {
        d.lint = {
            ...d.lint,
            duplicate: true
        };
    }

    fs.writeFileSync(path.join(__dirname, '../../data', './webcams.json'), JSON.stringify(webcams, null, 2));
}
