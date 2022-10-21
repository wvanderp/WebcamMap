export interface Webcam {
    lat: number;
    lon: number;

    osmID: number;
    user: string;
    osmType: string; // 'node' | 'way' | 'relation';
    lastChanged: number,

    address: {
        city?: string;
        county?: string;
        state?: string;
        country?: string;
    };

    osmTags: Record<string, string | undefined>;

    operator?: string;
    url: string;

    last404Check: number;
}
