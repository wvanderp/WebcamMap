import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {match} from 'react-router';
import * as R from 'ramda';
import {Map, Marker, Popup, TileLayer, Viewport} from 'react-leaflet';
import {Col, Container, Row, Table} from 'reactstrap';

import '../../style/WebcamPage.sass';

import {appState} from '../../reducers/RootReducer';

import MarkerIcon from '../parts/MarkerIcon';

import webcams from '../../../data/webcams.json';
import PopupContent from '../parts/PopupContent';
import {updateLocation, updateZoom} from '../../reducers/LocationReducer';
import {Webcam} from '../../types/webcam';
import AddressBreadCrumb from '../parts/AddressBreadCrumb';

import osmIcon from '../../static/osm.svg';
import playIcon from '../../static/play.svg';

interface ListPageProps {
    dispatch: Dispatch
    match: match<{ id: string }>
}

class ListPage extends React.Component<ListPageProps> {
    render(): React.ReactNode {
        const {id} = this.props.match.params;

        const filteredWebcams: Webcam[] = webcams.filter((r) => r.osmID === Number.parseInt(id, 10));

        if (filteredWebcams.length !== 1) {
            window.location.href = '/webcamMap/notfound';
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

        return (
            <div>
                <Map
                    center={[webcam.lat, webcam.lon]}
                    zoom={13}
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
                    {marker}
                </Map>
                <Container fluid>
                    <Row>
                        <Col md={6}>
                            <h1>{webcam.operator ?? 'Unknown'}</h1>
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
                                    {R.values(R.mapObjIndexed(
                                        (value, key) => (
                                            <tr key={`${key}-${value}`}>
                                                <td>{key}</td>
                                                <td>{value}</td>
                                            </tr>
                                        ),
                                        webcam.osmTags
                                    ))}
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
