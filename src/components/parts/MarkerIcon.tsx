import {icon} from 'leaflet';

// @ts-expect-error svg files are not compatible with typescript
import webcamIcon from 'url:../../static/camera.svg';

const iconHeight = 32;
const iconWidth = 32;

const MarkerIcon = icon({
    iconUrl: webcamIcon,
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight / 2]
});

export default MarkerIcon;
