import * as React from 'react';
import { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';

import webcams from '../../../data/webcams.json';
import brokenYT from '../../../data/badYoutubeLink.json';

import { Webcam } from '../../types/webcam';

function MaintenancePage() {
    document.title = 'Maintenance - CartoCams';

    const [youtubeFilter, setYoutubeFilter] = useState(false);
    const [nameFilter, setNameFilter] = useState(false);
    const [meFilter, setMeFilter] = useState(false);

    const webcamRow = webcams
        .filter((a) => (youtubeFilter ? a.url.includes('youtube') : true))
        .filter((a) => (nameFilter ? !a.osmTags.name : true))
        .filter((a) => (meFilter ? !a.osmTags.user === "wvdp" : true))
        .sort((a, b) => a.lastChanged - b.lastChanged)
        .map((webcam: Webcam) => (
            <tr key={webcam.osmID}>
                <td>{new Date(webcam.lastChanged).toISOString()}</td>
                <td>
                    <a
                        href={`https://www.openstreetmap.org/node/${webcam.osmID}`}
                    >
                        {`at osm ${webcam.osmID}`}

                    </a>
                </td>
                <td>
                    <a
                        href={`webcam/${webcam.osmID}`}
                    >
                        {`at cartocams ${webcam.osmID}`}

                    </a>
                </td>
            </tr>
        ));

    const brokenYTRows = brokenYT.map((badLink: Webcam) => (
        <tr key={badLink.osmID}>
            <td>{badLink.osmTags.name ?? 'no name'}</td>
            <td>
                <a href={badLink.url}>{badLink.url}</a>
            </td>
            <td>
                <a
                    href={`https://www.openstreetmap.org/node/${badLink.osmID}`}
                >
                    {`at osm ${badLink.osmID}`}

                </a>
            </td>
        </tr>
    ));

    const brokenYTTable = (
        <div>
            <h1>Broken YT Links</h1>
            <Row>
                <Col md={12}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>youtube link</th>
                                <th>osm link</th>
                            </tr>
                        </thead>
                        <tbody>{brokenYTRows}</tbody>
                    </table>
                </Col>
            </Row>
        </div>
    );

    return (
        <Container fluid>
            {brokenYT.length > 0 && brokenYTTable}
            <h1>Other things</h1>
            <Row>
                <Col md={6}>
                    filter:
                    {' '}
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setYoutubeFilter(!youtubeFilter)}
                        style={{ fontWeight: youtubeFilter ? 'bold' : 'normal' }}
                    >
                        Youtube
                    </span>
                    {' | '}
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setNameFilter(!nameFilter)}
                        style={{ fontWeight: nameFilter ? 'bold' : 'normal' }}
                    >
                        No Name
                    </span>
                    {' | '}
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setMeFilter(!nameFilter)}
                        style={{ fontWeight: meFilter ? 'bold' : 'normal' }}
                    >
                        Me
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
                    <tbody>{webcamRow}</tbody>
                </table>
            </Row>
        </Container>
    );
}

export default MaintenancePage;
