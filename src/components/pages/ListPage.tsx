import * as React from 'react';
import {useCallback, useEffect, useState } from 'react';
import {match} from 'react-router';
import chunk from 'lodash.chunk';

import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {LatLngBoundsLiteral, Map as LeafletMap} from 'leaflet';

import {Col, Container, Row} from 'reactstrap';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import PopupContent from '../parts/PopupContent';
import {Webcam} from '../../types/webcam';
import { decodeUrl, encodeUrl } from '../../utils/encodeUrl';

import useGlobalState from '../../state';

interface ListPageProps {
    match: match<{ name: string }>
}

const ListPage: React.FC<ListPageProps> = (props: ListPageProps) => {
    if (props.match.params.name.includes(' ')) {
        window.location.href = encodeUrl(decodeUrl(props.match.params.name));
    }

    const name = decodeUrl(props.match.params.name);
    const type = props.match.url.split('/')[1] as 'country' | 'state' | 'county' | 'city';

    if (type !== 'country' && type !== 'state' && type !== 'county' && type !== 'city') {
        window.location.href = '/notfound';
    }

    const filteredWebcams: Webcam[] = webcams.filter(
        (r: Webcam) => r.address[type]?.toLowerCase() === name.toLowerCase()
    );

    if (filteredWebcams.length === 0) {
        window.location.href = '/notfound';
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
                    <PopupContent webcam={webcam}/>
                </Popup>
            </Marker>
        );
    });

    const webcamTiles = filteredWebcams.map((r) => (
        <PopupContent key={r.osmID} webcam={r}/>
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

    const [map, setMap] = useState<LeafletMap | null>(null);
    const [_, updateLocation] = useGlobalState('location');

    const onMove = useCallback(() => {
        updateLocation({
            coordinates: [map?.getCenter().lat ?? 0, map?.getCenter().lng ?? 0],
            zoom: map?.getZoom() ?? 2
        });
    }, [map]);

    useEffect(() => {
        map?.on('move', onMove);
        return () => {
            map?.off('move', onMove);
        };
    },
    [map, onMove]);

    // TODO: make this page fit the bounds every time it move to a divert part. look at leaflet fitBounds function

    return (
        <div>
            <MapContainer
                bounds={bounds}
                id={'miniMap'}
                whenCreated={setMap}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
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
                            { tableBody }
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ListPage;
