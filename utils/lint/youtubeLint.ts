/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import youtubedl from 'youtube-dl-exec';

import { Webcam } from '../../src/types/webcam';

const webcamPath = path.join(__dirname, '../../data', './webcams.json');

// eslint-disable-next-line compat/compat, no-promise-executor-return
const delay = (ms: number) => new Promise((result) => setTimeout(result, ms));

async function isGoodYTLink(url: string): Promise<boolean> {
    try {
        const ytData = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            callHome: false,
            noCheckCertificates: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true
        });

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

    for (const youtubeLink of youtubeLinks) {
        console.log(`linting ${youtubeLink.url}`);

        const isGood = await isGoodYTLink(youtubeLink.url);

        youtubeLink.lint = {
            ...youtubeLink.lint,
            youtube: isGood ? undefined : true
        };
    }
    await delay(500);

    fs.writeFileSync(webcamPath, JSON.stringify(webcams, null, 2));
}
