/* eslint-disable no-restricted-syntax */
import youtubedl from 'youtube-dl-exec';

import fs from 'fs';
import path from 'path';
import data from '../../data/webcams.json';
import { Webcam } from '../../src/types/webcam';

// eslint-disable-next-line compat/compat, no-promise-executor-return
const delay = (ms: number) => new Promise((result) => setTimeout(result, ms));

async function isGoodYTLink(url: string): Promise<boolean> {
    try {
        const ytData = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            callHome: false,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true
        });

        return ytData.is_live === true;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        return false;
    }
}

export default async function lintYoutube() {
    const youtubeLinksFull = data.filter((a: Webcam) => (a.url.includes('youtube')));
    const youtubeLinksShort = data.filter((a: Webcam) => (a.url.includes('youtu.be')));

    const youtubeLinks = [...youtubeLinksFull, ...youtubeLinksShort];
    const badYoutubeLinks = [];

    for (const youtubeLink of youtubeLinks) {
        // eslint-disable-next-line no-console
        console.log(`linting ${youtubeLink.url}`);
        if (!(await isGoodYTLink(youtubeLink.url))) {
            badYoutubeLinks.push(youtubeLink);
        }
        await delay(500);
    }

    fs.writeFileSync(path.join(__dirname, '../../data', './badYoutubeLink.json'), JSON.stringify(badYoutubeLinks, null, 4));
}
