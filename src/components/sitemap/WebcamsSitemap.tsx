import * as React from 'react';
import * as R from 'ramda';
import {Col, Container, Row, Table} from 'reactstrap';

import webcams from '../../../data/webcams.json';
import {Webcam} from '../../types/webcam';
import PopupContent from '../parts/PopupContent';

export default function WebcamsSitemapPage(): React.ReactNode {
    const webcamTiles = (webcams as Webcam[]).map((webcam) => (
        <Col key={webcam.osmID} lg={4} md={6} sm={12}>
            <PopupContent key={webcam.osmID} webcam={webcam} hasHeaderLink/>
        </Col>
    ));

    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <h1>All Webcams</h1>
                </Col>
            </Row>
            <Row>
                {webcamTiles}
            </Row>
        </Container>
    );
}
