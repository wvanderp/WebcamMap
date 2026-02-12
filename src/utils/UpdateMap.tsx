import { useMapEvents } from 'react-leaflet';
import useGlobalState from '../state';

export default function UpdateMap() {

	const [_, updateLocation] = useGlobalState('location');

	const update = (mapInstance: L.Map) => {
		updateLocation({
			coordinates: [mapInstance.getCenter().lat, mapInstance.getCenter().lng],
			zoom: mapInstance.getZoom()
		});
	};

	const map = useMapEvents({
		zoom: () => update(map),
		move: () => update(map)
	});

	return null;
}
