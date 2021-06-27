import * as React from 'react';
import { useState } from 'react';
import {Col, Container, Row} from 'reactstrap';

import webcams from '../../../data/webcams.json';
import {Webcam} from '../../types/webcam';

const MaintenancePage: React.FC = () => {
    const [youtubeFilter, setYoutubeFilter] = useState(false);

    const webcamRow = webcams
        .filter((a) => (youtubeFilter ? a.url.includes('youtube') : true))
        .sort((a, b) => a.lastChanged - b.lastChanged)
        .map((webcam: Webcam) => (
            <tr key={webcam.osmID}>
                <td>{(new Date(webcam.lastChanged)).toISOString()}</td>
                <td><a href={`https://www.openstreetmap.org/node/${webcam.osmID}`}>{`at osm ${webcam.osmID}`}</a></td>
                <td><a href={`webcam/${webcam.osmID}`}>{`at cartocams ${webcam.osmID}`}</a></td>
            </tr>
        ));

    document.title = 'Maintenance - CartoCams';

    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    filter:
                    {' '}
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setYoutubeFilter(!youtubeFilter)}
                        style={{fontWeight: youtubeFilter ? 'bold' : 'normal'}}
                    >
                        youtube
                    </span>
                </Col>
            </Row>
            <Row>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>webcam at osm</th>
                            <th>webcam at cartocams</th>
                        </tr>
                    </thead>
                    <tbody>
                        {webcamRow}
                    </tbody>
                </table>
            </Row>
        </Container>
    );
};

export default MaintenancePage;
