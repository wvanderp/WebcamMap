import * as React from 'react';
import {Webcam} from '../../types/webcam';

const AddressBreadCrumb: React.FC<{ address: Webcam['address'] }> = (props: { address: Webcam['address'] }) => {
    const {address} = props;
    return (
        <ul className={'breadCrumbs'}>
            {address.country && <li className={'breadCrumb'}><a href={`/webcammap/country/${address.country}`}>{address.country}</a></li>}
            {address.state && <li className={'breadCrumb'}><a href={`/webcammap/state/${address.state}`}>{address.state}</a></li>}
            {address.county && <li className={'breadCrumb'}><a href={`/webcammap/county/${address.county}`}>{address.county}</a></li>}
            {address.city && <li className={'breadCrumb'}><a href={`/webcammap/city/${address.city}`}>{address.city}</a></li>}
        </ul>
    );
};

export default AddressBreadCrumb;
