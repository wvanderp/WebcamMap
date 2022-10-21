import lint404 from './lint404';
import lintYoutube from './youtubeLint';

(async () => {
    lintYoutube();
    lint404();
})().catch((error) => { throw error; });
