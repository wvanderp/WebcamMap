/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';
import data from '../../data/webcams.json';
import { Webcam } from '../../src/types/webcam';

const maxInterval = 30 * 24 * 60 * 60 * 1000; // 30 days in miliseconds
const bad404LinksPath = path.join(__dirname, '../../data', './404Link.json');

// https://stackoverflow.com/a/49479872
function getRandom<T>(items: T[], n: number): T[] {
    return items
        .map((x) => ({ x, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map((a) => a.x)
        .slice(0, n);
}

function load404File(): Webcam[] {
    if (fs.existsSync(bad404LinksPath)) {
        return JSON.parse(fs.readFileSync(bad404LinksPath).toString());
    }
    return [];
}

export default async function lint404() {
    const webcams = data as Webcam[];
    const badLinks: Webcam[] = [];

    // only check urls that need checking
    const filteredWebcams = webcams.filter((w) => {
        const sinceLastCheck = ((Date.now()) - w.last404Check);
        return w.last404Check === 0 || sinceLastCheck > maxInterval;
    });

    const old404Links = load404File();

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

            badLinks.push(webcam);
        }
        const webcamIndex = webcams.findIndex((w) => w.osmID === webcam.osmID);
        webcams[webcamIndex].last404Check = Date.now();
    }

    fs.writeFileSync(bad404LinksPath, JSON.stringify(badLinks, null, 4));
    fs.writeFileSync(path.join(__dirname, '../../data', './webcams.json'), JSON.stringify(webcams, null, 2));
}
