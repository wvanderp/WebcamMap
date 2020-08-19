import * as React from 'react';
import {PropsWithChildren} from 'react';
// @ts-expect-error  svg files are not compatible with typescript
import playIcon from '../../static/play.svg';
// @ts-expect-error  svg files are not compatible with typescript
import osmIcon from '../../static/osm.svg';

import {Webcam} from '../../types/webcam';

const pattern = /^((http|https|ftp):\/\/)/;

const AddressBreadCrumb: React.FC<{ address: Webcam['address'] }> = (props: { address: Webcam['address'] }) => {
    const {address} = props;
    return (
        <ul className={'breadCrumbs'}>
            {address.country && <li className={'breadCrumb'}>{address.country}</li>}
            {address.state && <li className={'breadCrumb'}>{address.state}</li>}
            {address.county && <li className={'breadCrumb'}>{address.county}</li>}
            {address.city && <li className={'breadCrumb'}>{address.city}</li>}
        </ul>
    );
};

interface PopupContentProps {
    webcam: Webcam
}

const PopupContent: React.FC<PropsWithChildren<PopupContentProps>> = (props: PropsWithChildren<PopupContentProps>) => {
    const {webcam} = props;

    const url = pattern.test(webcam.url) ? webcam.url : `http://${webcam.url}`;

    return (
        <div id={'PopupContent'}>
            <h1>{webcam.operator ?? 'Unknown'}</h1>
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
