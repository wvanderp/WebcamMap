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
