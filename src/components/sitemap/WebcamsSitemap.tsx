import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import * as R from 'ramda';
import {Col, Container, Row, Table} from 'reactstrap';

import {appState} from '../../reducers/RootReducer';
import webcams from '../../../data/webcams.json';
import {Webcam} from '../../types/webcam';
import PopupContent from '../parts/PopupContent';

interface WebcamsSitemapProps {
    dispatch: Dispatch
}

class WebcamsSitemapPage extends React.Component<WebcamsSitemapProps> {
    render(): JSX.Element {
        const webcamTiles = R.map((r) => (
            <PopupContent key={r.osmID} webcam={r} hasHeaderLink/>
        ), webcams as Webcam[]);

        return (
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1>All Webcams</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table>
                            <tbody>
                                {
                                    R.addIndex(R.map)(
                                        (r, i) => (
                                            <tr key={i}>
                                                {
                                                    R.addIndex(R.map)(
                                                        (t, j) => (
                                                            <td key={j}>{t}</td>
                                                        ),
                                                        r
                                                    )
                                                }
                                            </tr>
                                        ),
                                        R.splitEvery<JSX.Element>(3, webcamTiles)
                                    )
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect((state: appState, props) => ({}))(WebcamsSitemapPage);
