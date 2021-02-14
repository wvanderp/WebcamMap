import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {match} from 'react-router';
import chunk from 'lodash.chunk';
import {Map, Marker, Popup, TileLayer, Viewport, LatLngBoundsLiteral} from 'react-leaflet';
import {Col, Container, Row, Table} from 'reactstrap';

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

        const filteredWebcams: Webcam[] = webcams.filter(
            (r: Webcam) => r.address[type as 'country' | 'state' | 'county' | 'city']?.toLowerCase() === name.toLowerCase()
        );

        const lats: Webcam['lat'][] = filteredWebcams.map((webcam) => webcam.lat);
        const lons: Webcam['lon'][] = filteredWebcams.map((webcam) => webcam.lon);

        const bounds: LatLngBoundsLiteral = [
            [Math.max(...lats), Math.min(...lons)],
            [Math.min(...lats), Math.max(...lons)]
        ];

        const markers = filteredWebcams.map((webcam) => {
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

        const webcamTiles = filteredWebcams.map((r) => (
            <PopupContent key={r.osmID} webcam={r} hasHeaderLink/>
        ));

        const tableBody = chunk(webcamTiles, 3).map(
            (r, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={index}>
                    {
                        r.map(
                            (t, index_) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <td key={index_}>{t}</td>
                            )
                        )
                    }
                </tr>
            )
        );

        document.title = `${name} - CartoCams`;

        return (
            <div>
                <Map
                    bounds={bounds}
                    boundsOptions={{padding: [5, 5]}}
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
                                    { tableBody }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default connect(() => ({}))(ListPage);
