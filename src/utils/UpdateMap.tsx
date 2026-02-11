import { useMapEvents } from 'react-leaflet';
import useGlobalState from '../state';

export default function UpdateMap() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, updateLocation] = useGlobalState('location');
    const update = () => {
        updateLocation({
            coordinates: [map.getCenter().lat, map.getCenter().lng],
            zoom: map.getZoom()
        });
    };

    const map = useMapEvents({
        zoom: update,
        move: update
    });
    return null;
}
