import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {match} from 'react-router';
import * as R from 'ramda';
import {Map, Marker, Popup, TileLayer, Viewport} from 'react-leaflet';
import {Col, Container, Row, Table} from 'reactstrap';

import {appState} from '../../reducers/RootReducer';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import PopupContent from '../parts/PopupContent';
import {updateLocation, updateZoom} from '../../reducers/LocationReducer';
import {Webcam} from '../../types/webcam';

interface ListPageProps {
    dispatch: Dispatch
    match: match<{ name: string }>
}

class ListPage extends React.Component<ListPageProps> {
    render(): React.ReactNode {
        const name = decodeURIComponent(this.props.match.params.name);
        const type = this.props.match.url.split('/')[1];

        if (type !== 'country' && type !== 'state' && type !== 'county' && type !== 'city') {
            window.location.href = '/webcamMap/notfound';
        }

        const filteredWebcams = R.filter(
            (r) => r.address[type as 'country' | 'state' | 'county' | 'city']?.toLowerCase() === name.toLowerCase(),
            webcams
        ) as unknown as Webcam[];

        const lats = R.pluck('lat', filteredWebcams) as Webcam['lat'][];
        const lons = R.pluck('lon', filteredWebcams) as Webcam['lon'][];

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const zoom = filteredWebcams.length === 1 ? 13 : Math.min(maxLat - minLat, maxLon - minLon) * 4;
        const lat = (maxLat + minLat) / 2;
        const lon = (maxLon + minLon) / 2;

        const markers = R.map((webcam) => {
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
        }, filteredWebcams);

        const webcamTiles = R.map((r) => (
            <PopupContent key={r.osmID} webcam={r} hasHeaderLink/>
        ), filteredWebcams);

        return (
            <div>
                <Map
                    center={[lat, lon]}
                    zoom={zoom}
                    id={'miniMap'}
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
                <Container fluid>
                    <Row>
                        <Col md={6}>
                            <h1>{name}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table>
                                <tbody>
                                    {
                                        R.addIndex(R.map)(
                                            (r, index) => (
                                                <tr key={index}>
                                                    {
                                                        R.addIndex(R.map)(
                                                            (t, index) => (
                                                                <td key={index}>{t}</td>
                                                            ),
                                                            r
                                                        )
                                                    }
                                                </tr>
                                            ),
                                            R.splitEvery(3, webcamTiles)
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default connect((state: appState, props) => ({}))(ListPage);
