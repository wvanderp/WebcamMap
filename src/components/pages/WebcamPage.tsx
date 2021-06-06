import * as React from 'react';
import {useCallback, useEffect, useState } from 'react';

import {match} from 'react-router';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {Map as LeafletMap} from 'leaflet';

import {Col, Container, Row, Table} from 'reactstrap';

import '../../style/WebcamPage.sass';

// @ts-expect-error svg files are not compatible with typescript
import osmIcon from 'url:../../static/osm.svg';
// @ts-expect-error svg files are not compatible with typescript
import playIcon from 'url:../../static/play.svg';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import PopupContent from '../parts/PopupContent';
import {Webcam} from '../../types/webcam';
import AddressBreadCrumb from '../parts/AddressBreadCrumb';
import generateName from '../../utils/generateName';

import useGlobalState from '../../state';

interface ListPageProps {
    match: match<{ id: string }>
}

const ListPage: React.FC<ListPageProps> = (props: ListPageProps) => {
    const {id} = props.match.params;

    const filteredWebcams: Webcam[] = webcams.filter((webcam: Webcam) => webcam.osmID === Number.parseInt(id, 10));

    if (filteredWebcams.length !== 1) {
        window.location.href = '/notfound';
    }

    const webcam = filteredWebcams[0];

    const marker = (
        <Marker key={webcam.osmID} position={[webcam.lat, webcam.lon]} icon={MarkerIcon}>
            <Popup>
                <PopupContent webcam={webcam}/>
            </Popup>
        </Marker>
    );

    const pattern = /^((http|https|ftp):\/\/)/;
    const url = pattern.test(webcam.url) ? webcam.url : `http://${webcam.url}`;

    const tableBody = Object.entries(webcam.osmTags).map(
        ([key, value]) => (
            <tr key={`${key}-${value}`}>
                <td>{key}</td>
                <td>{value}</td>
            </tr>
        )
    );

    const cardTitle = generateName(webcam);
    document.title = `${cardTitle} - CartoCams`;

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

    return (
        <div>
            <MapContainer
                center={[webcam.lat, webcam.lon]}
                zoom={17}
                id={'miniMap'}
                whenCreated={setMap}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {marker}
            </MapContainer>
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1>{cardTitle}</h1>
                    </Col>
                    <Col md={6}>
                        <a
                            href={`https://www.openstreetmap.org/${webcam.osmType}/${webcam.osmID}`}
                            target={'_blank'}
                            rel="noopener noreferrer"
                        >
                            <img id={'osmLogo'} src={osmIcon} alt={'OSM Entity'}/>
                        </a>
                        <a
                            href={url}
                            target={'_blank'}
                            rel="noopener noreferrer"
                        >
                            <img
                                id={'osmLogo'}
                                src={playIcon}
                                alt={'Play The Stream'}
                            />
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <AddressBreadCrumb address={webcam.address}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table>
                            <tbody>
                                {tableBody}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ListPage;
