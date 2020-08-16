import * as React from 'react';

// @ts-expect-error  svg files are not compatible with typescript
import playIcon from '../../static/play.svg';
// @ts-expect-error  svg files are not compatible with typescript
import osmIcon from '../../static/osm.svg';

import {Webcam} from '../../types/webcam';

const pattern = /^((http|https|ftp):\/\/)/;

const PopupContent: React.FC<{ cam: Webcam }> = (props: { cam: Webcam }) => {
    const {cam} = props;

    const url = pattern.test(cam.url) ? cam.url : `http://${cam.url}`;

    return (
        <div id={'PopupContent'}>
            <h1>{cam.operator ?? 'Unknown'}</h1>
            <br/>
            <a
                href={`https://www.openstreetmap.org/${cam.osmType}/${cam.osmID}`}
                target={'_blank'}
                rel="noopener noreferrer"
            >
                <img id={'osmLogo'} src={osmIcon} alt={'OSM Entity'}/>
            </a>
            <a
                href={url}
                target={'_blank'}
                rel="noopener noreferrer"
            >
                <img
                    id={'osmLogo'}
                    src={playIcon}
                    alt={'Play The Stream'}
                />
            </a>
        </div>
    );
};

export default PopupContent;
