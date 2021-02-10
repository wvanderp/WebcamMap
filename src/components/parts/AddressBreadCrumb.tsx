import * as React from 'react';
import {Link} from 'react-router-dom';

import {Webcam} from '../../types/webcam';

const AddressBreadCrumb: React.FC<{ address: Webcam['address'] }> = (props: { address: Webcam['address'] }) => {
    const {address} = props;
    return (
        <ul className={'breadCrumbs'}>
            {address.country && <li className={'breadCrumb'}><Link to={`/country/${encodeURIComponent(address.country)}`}>{address.country}</Link></li>}
            {address.state && <li className={'breadCrumb'}><Link to={`/state/${encodeURIComponent(address.state)}`}>{address.state}</Link></li>}
            {address.county && <li className={'breadCrumb'}><Link to={`/county/${encodeURIComponent(address.county)}`}>{address.county}</Link></li>}
            {address.city && <li className={'breadCrumb'}><Link to={`/city/${encodeURIComponent(address.city)}`}>{address.city}</Link></li>}
        </ul>
    );
};

export default AddressBreadCrumb;
