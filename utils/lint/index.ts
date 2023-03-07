import lint404 from './lint404';
import lintClean from './lintClean';
import lintDuplicates from './lintDuplicates';
import lintInvalidUrls from './lintInvalidUrls';
import lintYoutube from './youtubeLint';

(async () => {
    await lintYoutube();
    await lint404();
    lintDuplicates();
    lintInvalidUrls();

    lintClean();
})().catch((error) => { throw error; });
