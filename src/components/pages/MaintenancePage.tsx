import React, { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';

import { Webcam } from '../../types/webcam';
import webcams from '../../webcams';

type Filters = {
    youtube: boolean;
    noName: boolean;
    noDescription: boolean;
    me: boolean;
    fixme: boolean;
    unavailable: boolean;
    badYoutube: boolean;
    invalidUrl: boolean;
    duplicate: boolean;
};


interface FilterButtonProps {
    filters: Filters;
    setFilter: React.Dispatch<React.SetStateAction<Filters>>;
    index: keyof Filters;
    text?: string;
}

// @ts-expect-error Props not properly typed due to dynamic component usage
// eslint-disable-next-line react/prop-types
function FilterButton({ filters, setFilter, index, text }) {
    return (
        <span
            role="button"
            tabIndex={0}
            onClick={() => setFilter(prev => ({
                ...prev,
                [index]: !prev[index]
            }))}
            style={{ fontWeight: filters[index] ? 'bold' : 'normal' }}
        >
            {text || index}
        </span>
    );
}

function stuffer<T, Y>(array: T[], element: Y): (T | Y)[] {
    return array.reduce<(T | Y)[]>(
        (collector, current, index, a) => (
            index < a.length - 1 ? [...collector, current, element] : [...collector, current]
        ), []
    );
}

function MaintenancePage() {
    document.title = 'Maintenance - CartoCams';

    const [filters, setFilters] = useState<Filters>({
        youtube: false,
        noName: false,
        noDescription: false,
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
        .filter((a: Webcam) => (filters.noDescription ? !a.osmTags.description : true))
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
                <td>{webcam.osmTags.name || 'no name'}</td>
                <td>
                    <a href={`https://www.openstreetmap.org/node/${webcam.osmID}`}>
                        {`at osm ${webcam.osmID}`}
                    </a>
                </td>
                <td>
                    <a href={`https://www.google.com/search?q=${webcam.osmTags.name}`}>Google</a>
                    {' '}
                    <a href={`https://www.youtube.com/results?search_query=${webcam.osmTags.name}`}>YouTube</a>
                    {' '}
                    <a href={`https://www.windy.com/?${webcam.lat},${webcam.lon},16`}>Windy</a>
                    {' '}
                </td>
            </tr>
        ));

    const filterRow = [
        FilterButton({ filters, setFilter: setFilters, index: 'youtube', text: 'YouTube' }),
        FilterButton({ filters, setFilter: setFilters, index: 'noName', text: 'No Name' }),
        FilterButton({ filters, setFilter: setFilters, index: 'noDescription', text: 'No Description' }),
        FilterButton({ filters, setFilter: setFilters, index: 'me', text: 'My Edits' }),
        FilterButton({ filters, setFilter: setFilters, index: 'fixme', text: 'Fixme' }),
        FilterButton({ filters, setFilter: setFilters, index: 'unavailable', text: '404' }),
        FilterButton({ filters, setFilter: setFilters, index: 'badYoutube', text: 'Bad YouTube link' }),
        FilterButton({ filters, setFilter: setFilters, index: 'invalidUrl', text: 'Invalid URL' }),
        FilterButton({ filters, setFilter: setFilters, index: 'duplicate', text: 'Duplicate' })
    ];

    return (
        <Container fluid>
            <h1>Find errors to fix</h1>
            <Row>
                <Col md={6}>
                    Filter:
                    {' '}
                    {stuffer(filterRow, ' | ')}
                </Col>
            </Row>
            <Row>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Name</th>
                            <th>Webcam at OSM</th>
                            <th>Quick Maintenance</th>
                        </tr>
                    </thead>
                    <tbody>{webcamRow}</tbody>
                </table>
            </Row>
        </Container>
    );
}

export default MaintenancePage;
