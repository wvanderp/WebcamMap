import * as React from 'react';
import * as R from 'ramda';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import Menu from '../parts/Menu';
import PopupContent from '../parts/PopupContent';

const MapView = (): JSX.Element => {
    const markers = R.map((r) => {
        if (r === null) {
            return null;
        }
        return (
            <Marker key={r.osmID} position={[r.lat, r.lon]} icon={MarkerIcon}>
                <Popup>
                    <PopupContent cam={r}/>
                </Popup>
            </Marker>
        );
    }, webcams);

    return (
        <div>
            <Menu/>
            <Map center={[0, 0]} zoom={2} id={'map'}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers}
            </Map>
        </div>
    );
};

export default MapView;
