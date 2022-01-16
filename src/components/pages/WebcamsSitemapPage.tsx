import * as React from 'react';
import {Col, Container, Row} from 'reactstrap';

import webcams from '../../../data/webcams.json';
import {Webcam} from '../../types/webcam';
import PopupContent from '../parts/PopupContent';

function WebcamsSitemapPage() {
    const webcamTiles = webcams.map((webcam: Webcam) => (
        <Col key={webcam.osmID} lg={4} md={6} sm={12}>
            <PopupContent key={webcam.osmID} webcam={webcam}/>
        </Col>
    ));

    document.title = 'Webcam - CartoCams';

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

export default WebcamsSitemapPage;
