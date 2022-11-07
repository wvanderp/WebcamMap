/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';
import data from '../../data/webcams.json';
import { Webcam } from '../../src/types/webcam';
import getRandom from '../lib/getRandom';

const maxInterval = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const bad404indexPath = path.join(__dirname, '../../data', './404Index.json');

// load the 404 index file
function load404Index(): Record<number, number> {
    if (fs.existsSync(bad404indexPath)) {
        return JSON.parse(fs.readFileSync(bad404indexPath).toString());
    }
    return {};
}

export default async function lint404() {
    const fourofourIndex = load404Index();

    const webcams = data as Webcam[];

    // only check urls that need checking
    const filteredWebcams = webcams.filter((w) => {
        const expiryDate = fourofourIndex[w.osmID] || 0;
        const already404 = !webcams.some((o) => !o.lint?.unavailable && o.osmID === w.osmID);

        return expiryDate < Date.now() || already404;
    });

    const old404Links = webcams.filter((w) => w.lint?.unavailable);

    const urlsToCheck = [...getRandom(filteredWebcams, 10), ...old404Links];

    for (const webcam of urlsToCheck) {
        console.log(`linting ${webcam.url}`);
        try {
            const { status } = await axios.get(webcam.url);

            if (status >= 400) {
                throw new Error(`this a bad link yall: ${status}`);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.message);
            } else {
                console.log(error);
            }

            webcam.lint = {
                ...webcam.lint,
                unavailable: true
            };
        }

        fourofourIndex[webcam.osmID] = Date.now() + maxInterval;
    }

    fs.writeFileSync(bad404indexPath, JSON.stringify(fourofourIndex, null, 4));
    fs.writeFileSync(path.join(__dirname, '../../data', './webcams.json'), JSON.stringify(webcams, null, 2));
}
