import * as R from 'ramda';
import * as React from 'react';
import {connect} from 'react-redux';
import {Col, Container, Row} from 'reactstrap';
import {Dispatch} from 'redux';
import webcams from '../../../data/webcams.json';

import {appState} from '../../reducers/RootReducer';
import {Webcam} from '../../types/webcam';

const ListComponents = (props: { tree: Record<string, unknown> | Webcam, level?: number }): JSX.Element => {
    if ('osmID' in props.tree || props.level === 4) {
        return null;
    }

    const level = props.level ?? 0;

    const levelLookup = {
        0: 'country',
        1: 'state',
        2: 'county',
        3: 'city'
    };

    return (
        <span>
            {
                R.values(R.mapObjIndexed((value, key) => (
                    <span key={key}>
                        {
                            key !== 'unknown'
                                ? <li><a href={`${levelLookup[level]}/${key}`}>{key}</a></li>
                                : <li>{key}</li>
                        }
                        <ul>
                            <ListComponents tree={value} level={level + 1}/>
                        </ul>
                    </span>
                ), props.tree))
            }
        </span>
    );
};

interface PlaceSitemapProps {
    dispatch: Dispatch
}

class PlaceSitemapPage extends React.Component<PlaceSitemapProps> {
    render(): JSX.Element {
        const tree = R.reduce(
            (accumulator, value) => R.assocPath(
                [
                    value.address.country ?? 'unknown',
                    value.address.state ?? 'unknown',
                    value.address.county ?? 'unknown',
                    value.address.city ?? 'unknown'
                ],
                value,
                accumulator
            ),
            {},
            webcams as unknown as Webcam[]
        );

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
}

export default connect((state: appState, props) => ({}))(PlaceSitemapPage);
