import * as React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet-rotatedmarker";

import MarkerIcon from '../parts/MarkerIcon';

import { Webcam } from '../../types/webcam';
import webcams from '../../../data/webcams.json';

import PopupContent from '../parts/PopupContent';
import UpdateMap from '../../utils/UpdateMap';

function MapView() {
    const markers = webcams.map((webcam: Webcam) => {
        if (webcam === null) {
            return null;
        }
        return (
            <Marker key={webcam.osmID} position={[webcam.lat, webcam.lon]} icon={MarkerIcon} rotationAngle={webcam.direction-90} rotationOrigin={"center center"}>
                <Popup>
                    <PopupContent webcam={webcam} />
                </Popup>
            </Marker>
        );
    });
    document.title = 'CartoCams';

    return (
        <div>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                id={'map'}
            >
                <TileLayer
                    attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMap />
                {markers}
            </MapContainer>
        </div>
    );
}

export default MapView;
