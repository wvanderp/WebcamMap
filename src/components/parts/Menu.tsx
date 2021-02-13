import * as React from 'react';
import {Navbar} from 'reactstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

// @ts-expect-error svg files are not compatible with typescript
import webcamIcon from 'url:../../static/icon.svg';
// @ts-expect-error svg files are not compatible with typescript
import attribution from 'url:../../static/attribution.svg';

import {appState} from '../../reducers/RootReducer';

interface MenuProps {
    location: [number, number];
    zoom: number
}

// eslint-disable-next-line react/prefer-stateless-function
class Menu extends React.Component<MenuProps> {
    render() {
        return (
            <nav>
                <div className="bg-dark collapse" id="navbarHeader">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8 col-md-7 py-4">
                                <h4 className="text-white">About</h4>
                                <p className="text-muted">
                                    This page displays all the webcams known to the OpenStreetMap.
                                    {' '}
                                    Zoom in to see if your local town or city has a webcam.
                                    <br/>
                                    <br/>
                                    Are you missing a webcam? Please raze a issue on
                                    {' '}
                                    <a
                                        href={`https://www.openstreetmap.org/note/new#map=${
                                            this.props.zoom}/${
                                            this.props.location[0]}/${
                                            this.props.location[1]}`}
                                    >
                                        OpenStreetMap
                                    </a>
                                    {', '}
                                    <a href={'https://github.com/github-actions[bot]/WebcamMap/issues/new'}>
                                        the projects Github Page
                                    </a>
                                    {' '}
                                    or learn how to add them yourself at
                                    {' '}
                                    <a href={'https://learnosm.org/'}>learn osm</a>
                                    {'.'}
                                    <br/>
                                    <br/>
                                    Do you have feedback? You can contact me via github.
                                </p>
                            </div>
                            <div className="col-sm-4 offset-md-1 py-4">
                                <h4 className="text-white">Links</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="https://overpass-turbo.eu/s/X74" className="text-white">
                                            The Overpass Query used to create the data
                                        </a>
                                    </li>
                                    <li className="text-muted">
                                        <a
                                            href="https://github.com/github-actions[bot]/WebcamMap"
                                            className="text-white"
                                        >
                                            The source code is available on Github
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={
                                                `https://www.openstreetmap.org/#map=${
                                                    this.props.zoom}/${
                                                    this.props.location[0]}/${
                                                    this.props.location[1]}`
                                            }
                                            className="text-white"
                                        >
                                            <img
                                                id={'osmAttribution'}
                                                alt={'This map proudly uses data made by OpenStreetMap.org contributors'}
                                                src={attribution}
                                            />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-sm-4 py-4">
                                <h4 className="text-white">Sitemap</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <Link to="webcams" className="text-white">
                                            All Webcams
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="places" className="text-white">
                                            All places
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Navbar color={'dark'} dark>
                    <div className="container d-flex justify-content-between">
                        <Link to="/" className="navbar-brand d-flex align-items-center">
                            <img src={webcamIcon} alt={'Carto Cams'}/>
                            <h1>Carto Cams</h1>
                        </Link>
                        <button
                            className="navbar-toggler collapsed"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarHeader"
                            aria-controls="navbarHeader"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"/>
                        </button>
                    </div>
                </Navbar>
            </nav>
        );
    }
}

export default connect((state: appState, props) => ({
    location: state.location.coordinates,
    zoom: state.location.zoom
}))(Menu);
