import * as React from 'react';
import {PropsWithChildren} from 'react';
// @ts-expect-error  svg files are not compatible with typescript
import playIcon from '../../static/play.svg';
// @ts-expect-error  svg files are not compatible with typescript
import osmIcon from '../../static/osm.svg';

import {Webcam} from '../../types/webcam';
import AddressBreadCrumb from './AddressBreadCrumb';

const pattern = /^((http|https|ftp):\/\/)/;

interface PopupContentProps {
    webcam: Webcam
    hasHeaderLink?: boolean
}

const PopupContent: React.FC<PropsWithChildren<PopupContentProps>> = (props: PropsWithChildren<PopupContentProps>) => {
    const {webcam} = props;

    const url = pattern.test(webcam.url) ? webcam.url : `http://${webcam.url}`;

    return (
        <div id={'PopupContent'}>
            {
                props.hasHeaderLink
                    ? <a href={`/webcammap/webcam/${webcam.osmID}`}><h1>{webcam.operator ?? 'Unknown'}</h1></a>
                    : <h1>{webcam.operator ?? 'Unknown'}</h1>
            }
            <br/>
            <AddressBreadCrumb address={webcam.address}/>
            <br/>
            <a
                href={`https://www.openstreetmap.org/${webcam.osmType}/${webcam.osmID}`}
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
