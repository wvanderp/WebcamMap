export interface Webcam {
    lat: number;
    lon: number

    operator?: string;
    url: string;

    address: {
        city?: string;
        county?: string;
        state?: string;
        country?: string;
    },

    osmID: number;
    osmType: 'node' | 'way' | 'relation'
}
