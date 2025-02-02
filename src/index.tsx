import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';

import 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import './style/main.sass';

import Menu from './components/parts/Menu';
import Loading from './components/parts/Loading';

import FourOFour from './components/pages/FourOFour';
import MapView from './components/pages/MapView';
import ListPage from './components/pages/ListPage';
import WebcamPage from './components/pages/WebcamPage';
import PlaceSitemapPage from './components/pages/PlaceSitemapPage';
import WebcamsSitemapPage from './components/pages/WebcamsSitemapPage';
import MaintenancePage from './components/pages/MaintenancePage';

const container = document.querySelector('#app');

if (container === null) {
    throw new Error('Container not found');
}

const root = createRoot(container);

root.render(
    <Router>
        <Menu />
        <Routes >
            <Route path="/" element={<Suspense fallback={<Loading />}><MapView/></Suspense>} />

            <Route path="/country/:name" element={<Suspense fallback={<Loading />}><ListPage/></Suspense>} />
            <Route path="/state/:name" element={<Suspense fallback={<Loading />}><ListPage/></Suspense>} />
            <Route path="/county/:name" element={<Suspense fallback={<Loading />}><ListPage/></Suspense>} />
            <Route path="/city/:name" element={<Suspense fallback={<Loading />}><ListPage/></Suspense>} />

            <Route path="/webcam/:id" element={<Suspense fallback={<Loading />}><WebcamPage/></Suspense>} />

            <Route path="/webcams/" element={<Suspense fallback={<Loading />}><WebcamsSitemapPage/></Suspense>} />
            <Route path="/places/" element={<Suspense fallback={<Loading />}><PlaceSitemapPage/></Suspense>} />
            <Route path="/maintenance/" element={<Suspense fallback={<Loading />}><MaintenancePage/></Suspense>} />

            <Route path="/404" element={<Suspense fallback={<Loading />}><FourOFour/></Suspense>} />
            <Route path="*" element={<Suspense fallback={<Loading />}><FourOFour/></Suspense>} />
        </Routes >
    </Router>
);

// eslint-disable-next-line no-console
console.log('welcome to the CartoCams');
