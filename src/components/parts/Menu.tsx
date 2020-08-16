import * as React from 'react';
import {Navbar} from 'reactstrap';

// @ts-expect-error svg files are not compatible with typescript
import webcamIcon from '../../static/icon.svg';

// @ts-expect-error svg files are not compatible with typescript
import attribution from '../../static/attribution.svg';

const Menu: React.FC = () => (
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
                            <a href={'https://www.openstreetmap.org/note/new'}>OpenStreetMap</a>
                            {', '}
                            <a href={'https://github.com/github-actions[bot]/WebcamMap/issues/new'}>
                                the projects Github Page
                            </a>
                            {' '}
                            or learn how to add them yourself at
                            {' '}
                            <a href={'https://learnosm.org/'}>learn osm</a>
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
                                The source code is available
                                <a href="https://github.com/github-actions[bot]/WebcamMap" className="text-white">On Github</a>
                            </li>
                            <li>
                                <a href="https://www.openstreetmap.org/" className="text-white">
                                    <img
                                        id={'osmAttribution'}
                                        alt={'This map proudly uses data made by OpenStreetMap.org contributors'}
                                        src={attribution}
                                    />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Navbar color={'dark'} dark>
            <div className="container d-flex justify-content-between">
                <a href="/" className="navbar-brand d-flex align-items-center">
                    <img src={webcamIcon} alt={'Webcam map'}/>
                    <h1>Webcam Map</h1>
                </a>
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

export default Menu;
