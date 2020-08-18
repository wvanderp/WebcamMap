import * as React from 'react';
import * as R from 'ramda';
import {Map, Marker, Popup, TileLayer, Viewport} from 'react-leaflet';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import Menu from '../parts/Menu';
import PopupContent from '../parts/PopupContent';
import {updateLocation, updateZoom} from '../../reducers/LocationReducer';
import {Dispatch} from 'react';
import {UPDATE_LOCATION_ACTION_ACTIONS} from '../../types/actions/LocationActions';
import {view} from 'ramda';
import {connect} from 'react-redux';
import {appState} from '../../reducers/RootReducer';

interface MapViewProps {
    dispatch: Dispatch
}

class MapView extends React.Component<MapViewProps> {
    render(): JSX.Element {
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

export default connect((state: appState, props) => ({}))(MapView);
