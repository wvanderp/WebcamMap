import * as React from 'react';
import {Link} from 'react-router-dom';

// @ts-expect-error svg files are not compatible with typescript
import webcamIcon from 'url:../../static/icon.svg';
// @ts-expect-error svg files are not compatible with typescript
import attribution from 'url:../../static/attribution.svg';

import useGlobalState from '../../state';

function Menu() {
    const [location] = useGlobalState('location');

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img src={webcamIcon} alt={'Carto Cams'}/>
                    Carto Cams
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-8 col-md-7 py-4">
                                <h4 className="text-white">About</h4>
                                <p className="text-muted">
                                    This page displays all the webcams known to OpenStreetMap.
                                    {' '}
                                    Zoom in to see if your local town or city has a webcam.
                                    <br/>
                                    <br/>
                                    Are you missing a webcam? Please raze an issue on
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
                                        the project's Github Page
                                    </a>
                                    {' '}
                                    or learn how to add them yourself at
                                    {' '}
                                    <a href={'https://learnosm.org/'}>LearnOSM</a>
                                    {'.'}
                                    <br/>
                                    <br/>
                                    Do you have feedback? You can contact me via GitHub.
                                </p>
                            </div>
                            <div className="col-sm-4 offset-md-1 py-4">
                                <h4 className="text-white">Links</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="https://overpass-turbo.eu/s/15aA" className="text-white">
                                            The Overpass query used to create the data
                                        </a>
                                    </li>
                                    <li className="text-muted">
                                        <a
                                            href="https://github.com/wvanderp/WebcamMap"
                                            className="text-white"
                                        >
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
                                            className="text-white"
                                        >
                                            <img
                                                id={'osmAttribution'}
                                                alt={'This map proudly uses data made by openstreetmap.org contributors'}
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
                                        <Link to="/webcams" className="text-white">
                                            All webcams
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/places" className="text-white">
                                            All places
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
