import * as React from 'react';
import {Link} from 'react-router-dom';

import {Webcam} from '../../types/webcam';
import { encodeUrl } from '../../utils/encodeUrl';

function AddressBreadCrumb(props: { address: Webcam['address'] }) {
    const {address} = props;
    return (
        <ul className={'breadCrumbs'}>
            {address.country && <li className={'breadCrumb'}><Link to={`/country/${encodeUrl(address.country)}`}>{address.country}</Link></li>}
            {address.state && <li className={'breadCrumb'}><Link to={`/state/${encodeUrl(address.state)}`}>{address.state}</Link></li>}
            {address.county && <li className={'breadCrumb'}><Link to={`/county/${encodeUrl(address.county)}`}>{address.county}</Link></li>}
            {address.city && <li className={'breadCrumb'}><Link to={`/city/${encodeUrl(address.city)}`}>{address.city}</Link></li>}
        </ul>
    );
}

export default AddressBreadCrumb;
