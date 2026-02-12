import React, { useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

import webcams from '../../webcams';

import { Webcam } from '../../types/webcam';
import { encodeUrl } from '../../utils/encodeUrl';

const levelLookup = {
    0: 'country',
    1: 'state',
    2: 'county',
    3: 'city'
};

interface ListComponentsProps {
    tree: Record<string, unknown> | Webcam,
    level?: 0 | 1 | 2 | 3 | 4
}

function setNestedValue(target: Record<string, unknown>, path: string[], value: Webcam): Record<string, unknown> {
    let current: Record<string, unknown> = target;

    for (const [index, key] of path.entries()) {
        const isLast = index === path.length - 1;

        if (isLast) {
            current[key] = value;
            continue;
        }

        const nextValue = current[key];

        if (typeof nextValue !== 'object' || nextValue === null || Array.isArray(nextValue) || 'osmID' in (nextValue as Record<string, unknown>)) {
            current[key] = {};
        }

        current = current[key] as Record<string, unknown>;
    }

    return target;
}

function ListComponents({ tree, level = 0 }: ListComponentsProps) {
    if ('osmID' in tree || level === 4) {
        return null;
    }

    if (level < 0 || level > 4) {
        return null;
    }

    return (
        <span>
            {
                Object.entries(tree).map(([key, value]) => (
                    <span key={key}>
                        {
                            key === 'unknown'
                                ? <li>{key}</li>
                                : <li><Link to={`/${levelLookup[level]}/${encodeUrl(key)}`} replace>{key}</Link></li>
                        }
                        <ul>
                            <ListComponents tree={value as Record<string, unknown> | Webcam} level={(level + 1) as 0 | 1 | 2 | 3 | 4} />
                        </ul>
                    </span>
                ))
            }
        </span>
    );
}

function PlaceSitemapPage() {
    const tree = webcams.reduce(
        (accumulator, value: Webcam) => setNestedValue(
            accumulator,
            [
                value.address.country ?? 'unknown',
                value.address.state ?? 'unknown',
                value.address.county ?? 'unknown',
                value.address.city ?? 'unknown'
            ],
            value
        ),
        {} as Record<string, unknown>
    );

    useEffect(() => {
        document.title = 'Places - CartoCams';
    }, []);
    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <h1>All Webcams</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListComponents tree={tree} />
                </Col>
            </Row>
        </Container>
    );
}

export default PlaceSitemapPage;
