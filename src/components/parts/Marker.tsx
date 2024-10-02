import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PopupContent from './PopupContent';
import { Webcam } from '../../types/webcam';
import MarkerIcon from './MarkerIcon';

export default function WebcamMarker(props: { webcam: Webcam }) {
    const { webcam } = props;
    const rotationAngle = webcam.direction === undefined ? 0 : webcam.direction - 90;
    return (
        <Marker key={webcam.osmID} position={[webcam.lat, webcam.lon]} icon={MarkerIcon} rotationAngle={rotationAngle} rotationOrigin={'center center'}>
            <Popup>
                <PopupContent webcam={webcam} />
            </Popup>
        </Marker>
    );
}
