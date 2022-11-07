import lint404 from './lint404';
import lintDuplicates from './lintDuplicates';
import lintInvalidUrls from './lintInvalidUrls';
import lintYoutube from './youtubeLint';

(async () => {
    await lintYoutube();
    await lint404();
    lintDuplicates();
    lintInvalidUrls();
})().catch((error) => { throw error; });
