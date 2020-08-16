import axios from 'axios';
import fs from 'fs';
import {Webcam} from './src/types/webcam';

export interface OsmResponse {
    version: number;
    generator: string;
    osm3s: {
        timestamp_osm_base: string;
        copyright: string;
    };
    elements?: {
        type: string;
        id: number;
        lat?: number | null;
        lon?: number | null;
        tags?: Record<string, string>;
        nodes?: (number)[] | null;
    }[];
}

const url = 'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22surveillance%22%3D%22webcam%22%5D%3Bway%5B%22surveillance%22%3D%22webcam%22%5D%3Brelation%5B%22surveillance%22%3D%22webcam%22%5D%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A';

(async () => {
    const data = (await axios.get(url)).data as OsmResponse;

    const nodes = data.elements;

    if (nodes === undefined) {
        throw new Error('did not fined any webcams');
    }

    const webcams: (Webcam | null)[] = nodes.map((r) => {
        if (r.tags === undefined) {
            return null;
        }

        if (r.lat === undefined || r.lat === null) {
            return null;
        }

        if (r.lon === undefined || r.lon === null) {
            return null;
        }

        return {
            lat: r.lat,
            lon: r.lon,

            osmID: r.id,
            osmType: r.type,

            operator: r.tags.operator,
            url: r.tags['contact:webcam'] ?? r.tags.url ?? r.tags['url:webcam'] ?? r.tags.website
        } as Webcam;
    });

    const filteredWebcams = webcams.filter((r) => r !== null);

    fs.writeFileSync('./data/raw.json', JSON.stringify(nodes));
    fs.writeFileSync('./data/webcams.json', JSON.stringify(filteredWebcams));
})();
