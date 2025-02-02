import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { MarkerCluster } from 'leaflet';

import { Webcam } from '../../types/webcam';
import webcams from '../../webcams';

import UpdateMap from '../../utils/UpdateMap';
import WebcamMarker from '../parts/Marker';

const createClusterCustomIcon = (cluster: MarkerCluster) => L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(33, 33, true)
});

function MapView() {
    const markers = webcams.map((webcam: Webcam) => {
        if (webcam === null) {
            return null;
        }
        return (<WebcamMarker key={webcam.osmID} webcam={webcam} />);
    });
    document.title = 'CartoCams';

    return (
        <div>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                id="map"
            >
                <TileLayer
                    attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMap />
                <MarkerClusterGroup
                    iconCreateFunction={createClusterCustomIcon}
                >
                    {markers}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}

export default MapView;
