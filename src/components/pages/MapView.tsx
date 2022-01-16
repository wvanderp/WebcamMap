import * as React from 'react';
import {useCallback, useEffect, useState } from 'react';
import {Map as LeafletMap} from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import useGlobalState from '../../state';

import MarkerIcon from '../parts/MarkerIcon';

import {Webcam} from '../../types/webcam';
import webcams from '../../../data/webcams.json';

import PopupContent from '../parts/PopupContent';

function MapView() {
    const markers = webcams.map((webcam: Webcam) => {
        if (webcam === null) {
            return null;
        }
        return (
            <Marker key={webcam.osmID} position={[webcam.lat, webcam.lon]} icon={MarkerIcon}>
                <Popup>
                    <PopupContent webcam={webcam}/>
                </Popup>
            </Marker>
        );
    });
    document.title = 'CartoCams';

    const [map, setMap] = useState<LeafletMap | null>(null);
    const [_, updateLocation] = useGlobalState('location');

    const onMove = useCallback(() => {
        updateLocation({
            coordinates: [map?.getCenter().lat ?? 0, map?.getCenter().lng ?? 0],
            zoom: map?.getZoom() ?? 2
        });
    }, [map]);

    useEffect(
        () => {
            map?.on('move', onMove);
            return () => {
                map?.off('move', onMove);
            };
        },
        [map, onMove]
    );

    return (
        <div>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                id={'map'}
                whenCreated={setMap}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers}
            </MapContainer>
        </div>
    );
}

export default MapView;
