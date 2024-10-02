/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import youtubedl from 'youtube-dl-exec';

import { Webcam } from '../../src/types/webcam';
import sleep from '../lib/sleep';

const webcamPath = path.join(__dirname, '../../data', './webcams.json');

const badYTindexPath = path.join(__dirname, '../../data', './YTIndex.json');

function loadYTIndex(): Record<string, { last: number, bad: boolean }> {
    if (fs.existsSync(badYTindexPath)) {
        return JSON.parse(fs.readFileSync(badYTindexPath).toString());
    }
    return {};
}

async function isGoodYTLink(url: string): Promise<boolean> {
    try {
        const ytData = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            callHome: false,
            noCheckCertificates: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
        });

        if (typeof ytData === 'string') {
            throw new TypeError(ytData);
        }

        return ytData.is_live === true;
    } catch (error) {
        // @ts-expect-error
        if (error.stderr) {
            // @ts-expect-error
            console.error(error.stderr);
        } else {
            console.error(error);
        }
        return false;
    }
}

export default async function lintYoutube() {
    const webcams = JSON.parse(fs.readFileSync(webcamPath).toString()) as Webcam[];

    const youtubeLinksFull: Webcam[] = webcams.filter((a: Webcam) => (a.url.includes('youtube')));
    const youtubeLinksShort: Webcam[] = webcams.filter((a: Webcam) => (a.url.includes('youtu.be')));

    const youtubeLinks = [...youtubeLinksFull, ...youtubeLinksShort];

    // add all the youtube links to the index if they are not already there
    const ytIndex = loadYTIndex();

    for (const ytLink of youtubeLinks) {
        if (!ytIndex[ytLink.url]) {
            ytIndex[ytLink.url] = { last: 0, bad: false };
        }
    }

    // remove all the youtube links from the index that are not in the list
    for (const ytIndexKey of Object.keys(ytIndex)) {
        if (!youtubeLinks.some((a) => a.url.includes(ytIndexKey.toString()))) {
            delete ytIndex[ytIndexKey];
        }
    }

    // select the youtube links that have not been checked in the last 30 days
    const youtubeLinksToCheck = youtubeLinks.filter((a) => {
        const lastCheck = ytIndex[a.url].last;
        return (Date.now() - lastCheck) > 30 * 24 * 60 * 60 * 1000 || ytIndex[a.url].bad;
    });

    for (const youtubeLink of youtubeLinksToCheck) {
        console.log(`linting ${youtubeLink.url}`);

        const isGood = await isGoodYTLink(youtubeLink.url);

        ytIndex[youtubeLink.url].last = Date.now();
        ytIndex[youtubeLink.url].bad = !isGood;

        youtubeLink.lint = {
            ...youtubeLink.lint,
            youtube: isGood ? undefined : true
        };
    }
    await sleep(500);

    fs.writeFileSync(webcamPath, JSON.stringify(webcams, null, 2));
}
