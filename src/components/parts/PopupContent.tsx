import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import PlayIcon from '../../static/play.svg?react';
import OsmIcon from '../../static/osm.svg?react';

import { Webcam } from '../../types/webcam';
import AddressBreadCrumb from './AddressBreadCrumb';
import generateName from '../../utils/generateName';

const pattern = /^((http|https|ftp):\/\/)/;

interface PopupContentProps {
    webcam: Webcam;
}

function PopupContent({ webcam }: PropsWithChildren<PopupContentProps>) {
    const url = pattern.test(webcam.url) ? webcam.url : `http://${webcam.url}`;
    const cardTitle = generateName(webcam);

    return (
        <div id="PopupContent">
            <Link to={`/webcam/${webcam.osmID}`}>
                <h1>{cardTitle}</h1>
            </Link>
            <br />
            <AddressBreadCrumb address={webcam.address} />
            <br />
            <a
                href={`https://www.openstreetmap.org/${webcam.osmType}/${webcam.osmID}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <OsmIcon id="buttonLogo" aria-label="See the webcam on OSM" title="See the webcam on OSM" />
            </a>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <PlayIcon id="buttonLogo" aria-label="Play the Stream" title="Play the Stream" />
            </a>
        </div>
    );
}

export default PopupContent;
