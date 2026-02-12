import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngBoundsLiteral } from 'leaflet';

import { Col, Container, Row } from 'reactstrap';

import PopupContent from '../parts/PopupContent';
import { Webcam } from '../../types/webcam';
import { decodeUrl, encodeUrl } from '../../utils/encodeUrl';

import UpdateMap from '../../utils/UpdateMap';
import WebcamMarker from '../parts/Marker';

import webcams from '../../webcams';

function chunkArray<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }

    return chunks;
}

function ListPage() {
    const params = useParams();

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
        return (<WebcamMarker key={webcam.osmID} webcam={webcam} />);
    });

    const webcamTiles = filteredWebcams.map((r) => (
        <PopupContent key={r.osmID} webcam={r} />
    ));

    const tableBody = chunkArray(webcamTiles, 4).map(
        (r, index) => (
            <Row key={index}>
                {
                    r.map(
                        (t, index_) => (
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
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
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
