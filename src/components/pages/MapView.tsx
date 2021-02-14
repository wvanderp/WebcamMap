import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {Map, Marker, Popup, TileLayer, Viewport} from 'react-leaflet';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import PopupContent from '../parts/PopupContent';
import {updateLocation, updateZoom} from '../../reducers/LocationReducer';
import {Webcam} from '../../types/webcam';

interface MapViewProps {
    dispatch: Dispatch
}

class MapView extends React.Component<MapViewProps> {
    render(): React.ReactNode {
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

        return (
            <div>
                <Map
                    center={[0, 0]}
                    zoom={2}
                    id={'map'}
                    onViewportChanged={
                        (viewport: Viewport): void => {
                            if (viewport.center === undefined || viewport.center === null) {
                                return;
                            }
                            if (viewport.zoom === undefined || viewport.zoom === null) {
                                return;
                            }
                            updateLocation(viewport.center, this.props.dispatch);
                            updateZoom(viewport.zoom, this.props.dispatch);
                        }
                    }
                >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers}
                </Map>
            </div>
        );
    }
}

export default connect(() => ({}))(MapView);
