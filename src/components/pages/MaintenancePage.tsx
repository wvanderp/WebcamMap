import * as React from 'react';
import { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';

import webcams from '../../../data/webcams.json';
import { Webcam } from '../../types/webcam';

// @ts-expect-error
// eslint-disable-next-line react/prop-types
function FilterButton({ filters, setFilter, index, text }) {
    return (
        <span
            role="button"
            tabIndex={0}
            onClick={() => setFilter({
                ...filters,
                [index]: !filters[index]
            })}
            style={{ fontWeight: filters[index] ? 'bold' : 'normal' }}
        >
            {text || index}
        </span>
    );
}

function stuffer<T, Y>(array: T[], element: Y): (T | Y)[] {
    // eslint-disable-next-line unicorn/no-array-reduce
    return array.reduce<(T | Y)[]>(
        (collector, current, index, a) => (
            index < a.length - 1 ? [...collector, current, element] : [...collector, current]
        ), []
    );
}

function MaintenancePage() {
    document.title = 'Maintenance - CartoCams';

    const [filters, setFilters] = useState({
        youtube: false,
        noName: false,
        me: false,
        fixme: false,

        unavailable: false,
        badYoutube: false,
        invalidUrl: false,
        duplicate: false
    });

    const webcamRow = webcams
        .filter((a: Webcam) => (filters.youtube ? a.url.includes('youtube') : true))
        .filter((a: Webcam) => (filters.noName ? !a.osmTags.name : true))
        .filter((a: Webcam) => (filters.me ? a.user === 'wvdp' : true))
        .filter((a: Webcam) => (filters.fixme ? Object.keys(a.osmTags).map((key) => key.toLowerCase()).includes('fixme') : true))

        .filter((a: Webcam) => (filters.unavailable ? a.lint?.unavailable : true))
        .filter((a: Webcam) => (filters.badYoutube ? a.lint?.youtube : true))
        .filter((a: Webcam) => (filters.invalidUrl ? a.lint?.invalidUrl : true))
        .filter((a: Webcam) => (filters.duplicate ? a.lint?.duplicate : true))

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

    const filterRow = [
        FilterButton({ filters, setFilter: setFilters, index: 'youtube', text: 'Youtube' }),
        FilterButton({ filters, setFilter: setFilters, index: 'noName', text: 'No Name' }),
        FilterButton({ filters, setFilter: setFilters, index: 'me', text: 'My Edits' }),
        FilterButton({ filters, setFilter: setFilters, index: 'fixme', text: 'Fixme' }),

        FilterButton({ filters, setFilter: setFilters, index: 'unavailable', text: '404' }),
        FilterButton({ filters, setFilter: setFilters, index: 'badYoutube', text: 'Bad Youtube link' }),
        FilterButton({ filters, setFilter: setFilters, index: 'invalidUrl', text: 'Invalid URL' }),
        FilterButton({ filters, setFilter: setFilters, index: 'duplicate', text: 'Duplicate' })
    ];

    return (
        <Container fluid>
            <h1>Other things</h1>
            <Row>
                <Col md={6}>
                    filter:
                    {' '}
                    {stuffer(filterRow, ' | ')}
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
