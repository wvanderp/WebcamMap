/* eslint-disable unicorn/prefer-object-from-entries */
// @ts-nocheck
import * as React from 'react';
import {Col, Container, Row} from 'reactstrap';
import {Link} from 'react-router-dom';
import set from 'lodash.set';

import webcams from '../../../data/webcams.json';

import {Webcam} from '../../types/webcam';
import { encodeUrl } from '../../utils/encodeUrl';

interface ListComponentsProps{
    tree: Record<string, unknown> | Webcam,
    // eslint-disable-next-line react/require-default-props
    level?: number
}

function ListComponents({tree, level = 0}: ListComponentsProps) {
    if ('osmID' in tree || level === 4) {
        return null;
    }

    if (level < 0 || level > 4) {
        return null;
    }

    const levelLookup = {
        0: 'country',
        1: 'state',
        2: 'county',
        3: 'city'
    };

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
                            <ListComponents tree={value} level={level + 1}/>
                        </ul>
                    </span>
                ))
            }
        </span>
    );
}

function PlaceSitemapPage() {
    // eslint-disable-next-line unicorn/prefer-object-from-entries, unicorn/no-array-reduce
    const tree = webcams.reduce(
        (accumulator, value: Webcam) => set(
            accumulator,
            [
                value.address.country ?? 'unknown',
                value.address.state ?? 'unknown',
                value.address.county ?? 'unknown',
                value.address.city ?? 'unknown'
            ],
            value
        ),
        {}
    );

    document.title = 'Places - CartoCams';
    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <h1>All Webcams</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListComponents tree={tree}/>
                </Col>
            </Row>
        </Container>
    );
}

export default PlaceSitemapPage;
