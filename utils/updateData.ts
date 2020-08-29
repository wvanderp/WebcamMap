import axios from 'axios';
import fs from 'fs';
import iso3311a2 from 'iso-3166-1-alpha-2';
import {Webcam} from '../src/types/webcam';

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

export interface NominatimResponse {
    address: {
        city: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        country_code: string;
    };
    boundingbox?: (string)[] | null;
    display_name: string;
    extratags: Record<string, string>;
    lat: string;
    licence: string;
    lon: string;
    osm_id: number;
    osm_type: 'node' | 'way' | 'relation';
    place_id: number;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const getNominatimCache = (): Record<string, NominatimResponse> => {
    try {
        return JSON.parse(fs.readFileSync('./data/nominatimCache.json').toString());
    } catch (error) {
        console.log(error);
        return {};
    }
};

const nominatimCache = getNominatimCache();
const getNominatimUrl = (
    lat: number, lon: number
) => `https://nominatim.openstreetmap.org/reverse?lon=${lon}&lat=${lat}&format=json&extratags=1`;

const overpassUrl = 'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22surveillance%22%3D%22webcam%22%5D%3Bway%5B%22surveillance%22%3D%22webcam%22%5D%3Brelation%5B%22surveillance%22%3D%22webcam%22%5D%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A';

const queryNominatim = async (lat: number, lon: number): Promise<NominatimResponse> => {
    if (Object.keys(nominatimCache).includes(`${lat},${lon}`)) {
        // eslint-disable-next-line no-console
        console.log(`hit cache for ${lat},${lon}`);
        return nominatimCache[`${lat},${lon}`];
    }
    const url = getNominatimUrl(lat, lon);
    // eslint-disable-next-line no-console
    console.log(`reaching to nominatim for ${lat},${lon}`);
    const {data} = await axios.get(url);

    await sleep(1000);

    nominatimCache[`${lat},${lon}`] = data;

    return data;
};

(async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('getting overpass');
    const data = (await axios.get(overpassUrl)).data as OsmResponse;

    const nodes = data.elements;

    if (nodes === undefined) {
        throw new Error('did not fined any webcams');
    }

    const webcams: (null | Webcam)[] = [];

    for (const r of nodes) {
        if (r.tags === undefined) {
            continue;
        }

        if (r.lat === undefined || r.lat === null) {
            continue;
        }

        if (r.lon === undefined || r.lon === null) {
            continue;
        }

        const nominatim = await queryNominatim(r.lat, r.lon);

        webcams.push({
            lat: r.lat,
            lon: r.lon,

            osmID: r.id,
            osmType: r.type,

            address: {
                city: nominatim.address.city ?? nominatim.address.town ?? nominatim.address.village,
                county: nominatim.address.county,
                state: nominatim.address.state,
                country: iso3311a2.getCountry(nominatim.address.country_code.toUpperCase())
            },

            osmTags: r.tags,

            operator: r.tags.operator,
            url: r.tags['contact:webcam'] ?? r.tags.url ?? r.tags['url:webcam'] ?? r.tags.website
        } as Webcam);
    }

    const filteredWebcams = webcams.filter((r) => r !== null);

    // eslint-disable-next-line no-console
    console.log('writing files');
    fs.writeFileSync('./data/raw.json', JSON.stringify(nodes, null, 2));
    fs.writeFileSync('./data/webcams.json', JSON.stringify(filteredWebcams, null, 2));
})();

function exitHandler(options: unknown, error: unknown) {
    // eslint-disable-next-line no-console
    console.log('writing cache file');
    fs.writeFileSync('./data/nominatimCache.json', JSON.stringify(nominatimCache, null, 2));
    // eslint-disable-next-line no-console
    console.log('errors?', options, error);
    if (error) throw (error);
    process.exit();
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);
