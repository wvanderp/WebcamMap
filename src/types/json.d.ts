import {Webcam} from './webcam';

declare module '../../../data/webcams.json' {
    const webcams: Webcam[];
    export default webcams;
}