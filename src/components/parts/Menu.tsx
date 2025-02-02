import React from 'react';
import {Link} from 'react-router-dom';

import WebcamIcon from '../../static/icon.svg?react';
import Attribution from '../../static/attribution.svg?react';
import query from '../../../overpassQuery.overpassql?raw';

import useGlobalState from '../../state';

function Menu() {
    const [location] = useGlobalState('location');

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <WebcamIcon aria-label={'Carto Cams'} id="logo"/>
                    Carto Cams
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-8 col-md-7 py-4">
                                <h4 className="white-text">About</h4>
                                <p className="muted-text">
                                    This page displays all the webcams known to OpenStreetMap.
                                    {' '}
                                    Zoom in to see if your local town or city has a webcam.
                                    <br/>
                                    <br/>
                                    Missing a webcam? Please raise an issue on
                                    {' '}
                                    <a
                                        href={`https://www.openstreetmap.org/note/new#map=${
                                            location.zoom}/${
                                            location.coordinates[0]}/${
                                            location.coordinates[1]}`}
                                    >
                                        OpenStreetMap
                                    </a>
                                    {', '}
                                    <a href={'https://github.com/wvanderp/WebcamMap/issues/new'}>
                                        our GitHub Page
                                    </a>
                                    {', '}
                                    or learn how to add them yourself at
                                    {' '}
                                    <a href={'https://learnosm.org/'}>LearnOSM</a>
                                    {'.'}
                                    <br/>
                                    <br/>
                                    Have feedback? Contact us via GitHub.
                                </p>
                            </div>
                            <div className="col-sm-4 offset-md-1 py-4">
                                <h4 className="text-white">Links</h4>
                                <ul className="list-unstyled muted-text">
                                    <li>
                                        <a href={`https://overpass-turbo.eu/?Q=${encodeURI(query)}`}>
                                            The Overpass query used to create the data
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/wvanderp/WebcamMap" >
                                            The source code is available on GitHub
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={
                                                `https://www.openstreetmap.org/#map=${
                                                    location.zoom}/${
                                                    location.coordinates[0]}/${
                                                    location.coordinates[1]}`
                                            }
                                            className="muted-text"
                                        >
                                            <Attribution
                                                id={'osmAttribution'}
                                                aria-label={'This map proudly uses data made by OpenStreetMap contributors'}
                                            />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-sm-4 py-4">
                                <h4 className="text-white">Sitemap</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <Link to="/webcams" className="muted-text">
                                            All Webcams
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/places" className="muted-text">
                                            All Places
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Menu;
