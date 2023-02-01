/* eslint-disable unicorn/no-array-reduce */
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
function load404Index(): Record<number, { last: number, bad: boolean }> {
    if (fs.existsSync(bad404indexPath)) {
        return JSON.parse(fs.readFileSync(bad404indexPath).toString());
    }
    return {};
}

export default async function lint404() {
    console.log('linting 404 links');
    const fourofourIndex = load404Index();

    const webcams = data as Webcam[];

    // only check urls that need checking
    const filteredWebcams = webcams.filter((w) => {
        const expiryDate = fourofourIndex[w.osmID]?.last ?? 0;
        const already404 = !webcams.some((o) => !o.lint?.unavailable && o.osmID === w.osmID);

        return expiryDate < Date.now() || already404;
    });

    const old404Links = Object.entries(fourofourIndex).filter((w) => w[1].bad)
        .reduce(
            (accumulator, w) => [...accumulator, webcams.find((o) => o.osmID === Number(w[0]))],
            [] as (Webcam | undefined)[]
        )
        .filter((w): w is Webcam => !!w);

    const urlsToCheck = [...getRandom(filteredWebcams, 10), ...old404Links];

    for (const webcam of urlsToCheck) {
        console.log(`linting ${webcam.url}`);
        try {
            const { status } = await axios.get(
                webcam.url,
                {
                    signal: AbortSignal.timeout(5000) // Aborts request after 5 seconds
                }
            );

            if (status >= 400) {
                throw new Error(`this a bad link y'all: ${status}`);
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

        fourofourIndex[webcam.osmID] = {
            last: Date.now() + maxInterval,
            bad: webcam.lint?.unavailable ?? false
        };
    }

    fs.writeFileSync(bad404indexPath, JSON.stringify(fourofourIndex, null, 4));
    fs.writeFileSync(path.join(__dirname, '../../data', './webcams.json'), JSON.stringify(webcams, null, 2));
}
