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

const FourOFour = React.lazy(() => import('./components/pages/FourOFour'));
const MapView = React.lazy(() => import('./components/pages/MapView'));
const ListPage = React.lazy(() => import('./components/pages/ListPage'));
const WebcamPage = React.lazy(() => import('./components/pages/WebcamPage'));
const PlaceSitemapPage = React.lazy(() => import('./components/pages/PlaceSitemapPage'));
const WebcamsSitemapPage = React.lazy(() => import('./components/pages/WebcamsSitemapPage'));
const MaintenancePage = React.lazy(() => import('./components/pages/MaintenancePage'));

const container = document.querySelector('#app');

if (container === null) {
    throw new Error('Container not found');
}

const root = createRoot(container);

root.render(
    <Router>
        <Suspense fallback={<Loading />}>
            <Menu />
            <Routes>
                <Route path="/" element={<MapView />} />
                <Route path="/country/:name" element={<ListPage />} />
                <Route path="/state/:name" element={<ListPage />} />
                <Route path="/county/:name" element={<ListPage />} />
                <Route path="/city/:name" element={<ListPage />} />
                <Route path="/webcam/:id" element={<WebcamPage />} />
                <Route path="/webcams/" element={<WebcamsSitemapPage />} />
                <Route path="/places/" element={<PlaceSitemapPage />} />
                <Route path="/maintenance/" element={<MaintenancePage />} />
                <Route path="/404" element={<FourOFour />} />
                <Route path="*" element={<FourOFour />} />
            </Routes>
        </Suspense>
    </Router>
);

console.log('welcome to the CartoCams');
