import {icon} from 'leaflet';

import webcamIcon from '../../static/camera.svg?url';

const iconHeight = 16;
const iconWidth = 32;

const MarkerIcon = icon({
    iconUrl: webcamIcon,
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight / 2]
});

export default MarkerIcon;
