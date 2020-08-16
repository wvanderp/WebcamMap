export interface Webcam {
    lat: number;
    lon: number

    operator?: string;
    url: string;

    osmID: number;
    osmType: 'node' | 'way' | 'relation'
}
