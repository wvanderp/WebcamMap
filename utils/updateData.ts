/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable no-console */
import axios from 'axios';
import fs from 'fs';
import iso3311a2 from 'iso-3166-1-alpha-2';
import { Webcam } from '../src/types/webcam';

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
        timestamp: string;
        version: number;
        changeset: number;
        user: string;
        uid: number;
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
    expires: number; // added by me
}

type NominatimCache = Record<string, NominatimResponse>

function sleep(ms: number): Promise<void> {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomInt(min: number, max: number): number {
    const roundedMin = Math.ceil(min);
    const RoundedMax = Math.floor(max);
    return Math.floor(Math.random() * (RoundedMax - roundedMin + 1)) + roundedMin;
}

const getNominatimCache = (): NominatimCache => {
    try {
        const file = fs.readFileSync('./data/nominatimCache.json').toString();
        const data: NominatimCache = JSON.parse(file);

        console.log('filtering out old nominatim responses');
        const filteredNominatim = Object.fromEntries(
            Object.entries(data).filter(
                (nominatim) => nominatim[1].expires && nominatim[1].expires > (Date.now() / 1000)
            )
        );

        console.log(`removed ${Object.values(data).length - Object.values(filteredNominatim).length
        } out of date responses`);

        return filteredNominatim;
    } catch {
        console.log('nominatim cache not found. no worries we continue');
        return {};
    }
};

const nominatimCache = getNominatimCache();
const getNominatimUrl = (
    lat: number, lon: number
) => `https://nominatim.openstreetmap.org/reverse?lon=${lon}&lat=${lat}&format=json&extratags=1`;

const overpassUrl = 'https://overpass.kumi.systems/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A180%5D%3B%0A%28%0A%20%20nwr%5B%22surveillance%22%3D%22traffic%22%5D%5B%22contact%3Awebcam%22%5D%3B%0A%20%20nwr%5B%22surveillance%22%3D%22webcam%22%5D%3B%0A%29%3B%0Aout%20meta%3B%0A';

const queryNominatim = async (lat: number, lon: number): Promise<NominatimResponse> => {
    if (Object.keys(nominatimCache).includes(`${lat},${lon}`)) {
        console.log(`hit cache for ${lat},${lon}`);
        return nominatimCache[`${lat},${lon}`];
    }
    const url = getNominatimUrl(lat, lon);

    console.log(`reaching to nominatim for ${lat},${lon}`);
    const { data } = await axios.get<NominatimResponse>(url);

    nominatimCache[`${lat},${lon}`] = {
        ...data,
        expires: Math.floor((Date.now() / 1000) + getRandomInt(259_200, 604_800))
    };

    await sleep(1000);
    return nominatimCache[`${lat},${lon}`];
};

(async (): Promise<void> => {
    if (!fs.existsSync('./data/')) {
        fs.mkdirSync('./data/');
    }

    console.log('getting overpass');

    const response = await axios.get<OsmResponse>(overpassUrl);

    if (response.status >= 400) {
        throw new Error(`got a ${response.status} from overpass`);
    }

    const { data } = response;
    const nodes = data.elements;

    if (nodes === undefined) {
        throw new Error('did not find any webcams');
    }
    console.log(`found ${nodes.length} possible webcams`);

    const webcams: (null | Webcam)[] = [];

    // eslint-disable-next-line no-restricted-syntax
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

        const url = r.tags['contact:webcam']
            ?? r.tags.url
            ?? r.tags['url:webcam']
            ?? r.tags.website
            ?? r.tags['contact:website'];

        if (url === undefined) {
            continue;
        }

        const nominatim = await queryNominatim(r.lat, r.lon);

        webcams.push({
            lat: r.lat,
            lon: r.lon,

            osmID: r.id,
            user: r.user
            osmType: r.type,

            lastChanged: Date.parse(r.timestamp),

            address: {
                city: nominatim.address.city ?? nominatim.address.town ?? nominatim.address.village,
                county: nominatim.address.county,
                state: nominatim.address.state,
                country: iso3311a2.getCountry(nominatim.address.country_code.toUpperCase())
            },

            osmTags: r.tags,

            operator: r.tags.operator,
            url
        } as Webcam);
    }

    const filteredWebcams = webcams.filter((r) => r !== null);

    console.log('writing files');
    fs.writeFileSync('./data/raw.json', JSON.stringify(nodes, null, 2));
    fs.writeFileSync('./data/webcams.json', JSON.stringify(filteredWebcams, null, 2));
})();

function exitHandler(options: unknown, error: unknown) {
    console.log('writing cache file');
    const nominatimCacheOrdered = Object.keys(nominatimCache).sort().reduce<NominatimCache>(
        (object, key) => {
            // eslint-disable-next-line no-param-reassign
            object[key] = nominatimCache[key];
            return object;
        },
        {}
    );
    fs.writeFileSync('./data/nominatimCache.json', JSON.stringify(nominatimCacheOrdered, null, 2));
    console.log('errors?', options, error);
    if (error) throw (error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);
