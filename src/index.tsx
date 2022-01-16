import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';

import 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import './style/main.sass';

import Menu from './components/parts/Menu';

import FourOFour from './components/pages/FourOFour';
import MapView from './components/pages/MapView';
import ListPage from './components/pages/ListPage';
import WebcamPage from './components/pages/WebcamPage';
import PlaceSitemapPage from './components/pages/PlaceSitemapPage';
import WebcamsSitemapPage from './components/pages/WebcamsSitemapPage';
import MaintenancePage from './components/pages/MaintenancePage';

ReactDOM.render(
    <Router>
        <Menu />
        <Routes >
            <Route path="/" element={<MapView/>} />

            <Route path="/country/:name" element={<ListPage/>} />
            <Route path="/state/:name" element={<ListPage/>} />
            <Route path="/county/:name" element={<ListPage/>} />
            <Route path="/city/:name" element={<ListPage/>} />

            <Route path="/webcam/:id" element={<WebcamPage/>} />

            <Route path="/webcams/" element={<WebcamsSitemapPage/>} />
            <Route path="/places/" element={<PlaceSitemapPage/>} />
            <Route path="/maintenance/" element={<MaintenancePage/>} />

            <Route path="/404" element={<FourOFour/>} />
            <Route path="*" element={<FourOFour/>} />
        </Routes >
    </Router>,
    document.querySelector('#app')
);

// eslint-disable-next-line no-console
console.log('welcome to the CartoCams');
