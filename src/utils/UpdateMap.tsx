import { useMapEvents } from 'react-leaflet';
import useGlobalState from '../state';

export default function UpdateMap() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, updateLocation] = useGlobalState('location');
    const update = () => {
        updateLocation({
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            coordinates: [map.getCenter().lat, map.getCenter().lng],
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            zoom: map.getZoom()
        });
    };

    const map = useMapEvents({
        zoom: update,
        move: update
    });
    return null;
}
