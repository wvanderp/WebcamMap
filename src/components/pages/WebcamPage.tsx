import * as React from 'react';

import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet-rotatedmarker';

import { Col, Container, Row, Table } from 'reactstrap';

import '../../style/WebcamPage.sass';

// @ts-expect-error svg files are not compatible with typescript
import osmIcon from 'url:../../static/osm.svg';
// @ts-expect-error svg files are not compatible with typescript
import playIcon from 'url:../../static/play.svg';

import webcams from '../../../data/webcams.json';
import { Webcam } from '../../types/webcam';
import AddressBreadCrumb from '../parts/AddressBreadCrumb';
import generateName from '../../utils/generateName';

import UpdateMap from '../../utils/UpdateMap';
import WebcamMarker from '../parts/Marker';

function ListPage() {
    const { id } = useParams();

    if (id === undefined) {
        return <Navigate to="/404" replace />;
    }

    const filteredWebcams: Webcam[] = webcams.filter((webcam: Webcam) => webcam.osmID === Number.parseInt(id, 10));

    if (filteredWebcams.length !== 1) {
        return <Navigate to="/404" />;
    }

    const webcam = filteredWebcams[0];
    const marker = (<WebcamMarker webcam={webcam} />);

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

    return (
        <div>
            <MapContainer
                center={[webcam.lat, webcam.lon]}
                zoom={17}
                id={'miniMap'}
            >
                <TileLayer
                    attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMap />
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
                            <img id={'osmLogo'} src={osmIcon} alt={'OSM Entity'} />
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
                        <AddressBreadCrumb address={webcam.address} />
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
}

export default ListPage;
