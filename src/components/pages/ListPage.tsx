import * as React from 'react';
import { useParams, Navigate } from 'react-router-dom';

import chunk from 'lodash.chunk';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngBoundsLiteral } from 'leaflet';

import { Col, Container, Row } from 'reactstrap';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import PopupContent from '../parts/PopupContent';
import { Webcam } from '../../types/webcam';
import { decodeUrl, encodeUrl } from '../../utils/encodeUrl';

import UpdateMap from '../../utils/UpdateMap';

function ListPage() {
    const params = useParams();
    // eslint-disable-next-line compat/compat
    const url = (new URL(window.location.href)).pathname;

    if (params.name === undefined) {
        return <Navigate to="/404" replace />;
    }

    if (params.name.includes(' ')) {
        return <Navigate to={encodeUrl(decodeUrl(params.name))} replace />;
    }

    const name = decodeUrl(params.name);
    const type = url.split('/')[1] as 'country' | 'state' | 'county' | 'city';

    if (type !== 'country' && type !== 'state' && type !== 'county' && type !== 'city') {
        return <Navigate to="/404" replace />;
    }

    const filteredWebcams: Webcam[] = webcams.filter(
        (r: Webcam) => r.address[type]?.toLowerCase() === name.toLowerCase()
    );

    if (filteredWebcams.length === 0) {
        return <Navigate to="/404" replace />;
    }

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
                    <PopupContent webcam={webcam} />
                </Popup>
            </Marker>
        );
    });

    const webcamTiles = filteredWebcams.map((r) => (
        <PopupContent key={r.osmID} webcam={r} />
    ));

    const tableBody = chunk(webcamTiles, 4).map(
        (r, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={index}>
                {
                    r.map(
                        (t, index_) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Col lg={3} md={6} sm={12} key={index_}>{t}</Col>
                        )
                    )
                }
            </Row>
        )
    );

    document.title = `${name} - CartoCams`;

    // TODO: make this page fit the bounds every time it moves to a divert part. look at leaflet fitBounds function

    return (
        <div>
            <MapContainer
                bounds={bounds}
                id={'miniMap'}
            >
                <TileLayer
                    attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMap />
                {markers}
            </MapContainer>
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1>{name}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Container fluid>
                            {tableBody}
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ListPage;
