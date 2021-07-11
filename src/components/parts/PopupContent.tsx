import * as React from 'react';
import {PropsWithChildren} from 'react';

import {Link} from 'react-router-dom';

// @ts-expect-error  svg files are not compatible with typescript
import playIcon from 'url:../../static/play.svg';
// @ts-expect-error  svg files are not compatible with typescript
import osmIcon from 'url:../../static/osm.svg';

import {Webcam} from '../../types/webcam';
import AddressBreadCrumb from './AddressBreadCrumb';
import generateName from '../../utils/generateName';

const pattern = /^((http|https|ftp):\/\/)/;

interface PopupContentProps {
    webcam: Webcam;
}

const PopupContent: React.FC<PropsWithChildren<PopupContentProps>> = (
    {webcam}: PropsWithChildren<PopupContentProps>
) => {
    const url = pattern.test(webcam.url) ? webcam.url : `http://${webcam.url}`;

    const cardTitle = generateName(webcam);

    return (
        <div id={'PopupContent'}>
            <Link to={`/webcam/${webcam.osmID}`}><h1>{cardTitle}</h1></Link>
            <br/>
            <AddressBreadCrumb address={webcam.address}/>
            <br/>
            <a
                href={`https://www.openstreetmap.org/${webcam.osmType}/${webcam.osmID}`}
                target={'_blank'}
                rel="noopener noreferrer"
            >
                <img id={'osmLogo'} src={osmIcon} alt={'See the webcam on OSM'} title={'See the webcam on OSM'}/>
            </a>
            <a
                href={url}
                target={'_blank'}
                rel="noopener noreferrer"
            >
                <img
                    id={'osmLogo'}
                    src={playIcon}
                    title={'Play The Stream'}
                    alt={'Play The Stream'}
                />
            </a>
        </div>
    );
};

export default PopupContent;
