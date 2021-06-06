import * as React from 'react';
import {Col, Container, Row} from 'reactstrap';

import webcams from '../../../data/webcams.json';
import {Webcam} from '../../types/webcam';

const OldestPage: React.FC = () => {
    const webcamRow = webcams
        .sort((a, b) => a.lastChanged - b.lastChanged)
        .map((webcam: Webcam) => (
            <tr key={webcam.osmID}>
                <td>{(new Date(webcam.lastChanged)).toISOString()}</td>
                <td><a href={`https://www.openstreetmap.org/node/${webcam.osmID}`}>{`at osm ${webcam.osmID}`}</a></td>
                <td><a href={`webcam/${webcam.osmID}`}>{`at cartocams ${webcam.osmID}`}</a></td>
            </tr>
        ));

    document.title = 'Oldest - CartoCams';

    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <h1>All Webcams</h1>
                </Col>
            </Row>
            <Row>
                <table>
                    <thead>
                        <th>Time</th>
                        <th>webcam at osm</th>
                        <th>webcam at cartocams</th>
                    </thead>
                    <tbody>
                        {webcamRow}
                    </tbody>
                </table>
            </Row>
        </Container>
    );
};

export default OldestPage;
