/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable no-console */
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import countries from 'i18n-iso-countries';
import englishCountry from 'i18n-iso-countries/langs/en.json';
import path from 'path';
import { Webcam } from '../src/types/webcam';
import getRandomInt from './lib/getRandomInt';
import sleep from './lib/sleep';
import { NominatimResponse, OsmResponse } from './lib/types';

countries.registerLocale(englishCountry);

type NominatimCache = Record<string, NominatimResponse>

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

        console.log(
            `removed ${Object.values(data).length - Object.values(filteredNominatim).length} out of date responses`
        );

        return filteredNominatim;
    } catch {
        console.log('nominatim cache not found. no worries we continue');
        return {};
    }
};

const nominatimCache = getNominatimCache();

const getNominatimUrl = (
    lat: number, lon: number
) => `https://nominatim.openstreetmap.org/reverse?lon=${lon}&lat=${lat}&format=json&extratags=1&accept-language=en`;

// overpass url
const overpassBase = 'https://overpass-api.de/api/interpreter?data=';
const query = fs.readFileSync(path.join(__dirname, '../overpassQuery.overpassql')).toString();

const overpassUrl = `${overpassBase}${encodeURIComponent(query)}`;

// maximum age of the cache in seconds
const nominatimMaxAge = 2 * 7 * 24 * 60 * 60; // 2 weeks
const aDay = 24 * 60 * 60; // max 1 day difference

const queryNominatim = async (lat: number, lon: number): Promise<NominatimResponse> => {
    const cacheKey = `${lat},${lon}`;

    if (Object.keys(nominatimCache).includes(cacheKey)) {
        console.log(`hit cache for '${cacheKey}'`);
        return nominatimCache[`${lat},${lon}`];
    }

    console.log(`reaching to nominatim for '${cacheKey}'`);
    const url = getNominatimUrl(lat, lon);
    const { data, status } = await axios.get<NominatimResponse>(url);

    if (status >= 400) {
        throw new Error(`got a ${status} from nominatim for '${cacheKey}'`);
    }

    nominatimCache[cacheKey] = {
        ...data,
        expires: Math.floor(
            (Date.now() / 1000) + getRandomInt(
                nominatimMaxAge + aDay,
                nominatimMaxAge - aDay)
        )
    };

    await sleep(1000);
    return nominatimCache[cacheKey];
};

// eslint-disable-next-line sonarjs/cognitive-complexity
(async (): Promise<void> => {
    if (!fs.existsSync('./data/')) {
        fs.mkdirSync('./data/');
    }

    console.log('getting overpass');
    let response = {} as AxiosResponse<OsmResponse>;
    try {
        response = await axios.get<OsmResponse>(overpassUrl);
    } catch (error) {
        console.log(error);
        console.log(response.data);
        throw new Error('could not get overpass');
    }

    if (response.status >= 400) {
        throw new Error(`got a ${response.status} from overpass`);
    }

    const { data } = response;
    const nodes = data.elements;

    if (nodes === undefined) {
        throw new Error('did not find any webcams');
    }

    console.log(`found ${nodes.length} possible webcams`);

    const webcams: Webcam[] = [];

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

        let direction = parseInt(r.tags["camera:direction"]);
        if (Number.isNaN(direction)) {
            direction = parseInt(r.tags["direction"]);
        }
        webcams.push({
            lat: r.lat,
            lon: r.lon,
            direction: Number.isNaN(direction) ? 90 : direction, // point east by default

            osmID: r.id,
            user: r.user,
            osmType: r.type,

            lastChanged: Date.parse(r.timestamp),

            address: {
                city: nominatim.address.city ?? nominatim.address.town ?? nominatim.address.village,
                county: nominatim.address.county,
                state: nominatim.address.state,
                country: countries.getName(nominatim.address.country_code.toUpperCase(), 'en')
            },

            osmTags: r.tags,

            operator: r.tags.operator,
            url
        } as Webcam);
    }

    console.log('writing files');
    fs.writeFileSync('./data/raw.json', JSON.stringify(nodes, null, 2));
    fs.writeFileSync('./data/webcams.json', JSON.stringify(webcams, null, 2));
})()
    .catch((error) => {
        console.error(`error: ${error}`);
    });

// exit handler saves the caches
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
