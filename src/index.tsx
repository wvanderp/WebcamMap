import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';

import 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import './style/main.sass';

import Menu from './components/parts/Menu';
import Loading from './components/parts/Loading';
import { initializeSentry } from './sentry';

// Initialize Sentry before rendering the app
initializeSentry();

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

// Create Sentry-enhanced Router
const SentryRoutes = Sentry.withSentryRouting(Routes);

root.render(
    <Sentry.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Oops! Something went wrong</h1>
                <p>We&apos;ve been notified and will look into it.</p>
                <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: '800px', margin: '20px auto' }}>
                    <summary>Error Details</summary>
                    <p>{error instanceof Error ? error.toString() : String(error)}</p>
                    {componentStack && <pre>{componentStack}</pre>}
                </details>
                <button
                    onClick={resetError}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                    }}
                >
                    Try Again
                </button>
            </div>
        )}
        showDialog={false}
    >
        <Router>
            <Suspense fallback={<Loading />}>
                <Menu />
                <SentryRoutes>
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
                </SentryRoutes>
            </Suspense>
        </Router>
    </Sentry.ErrorBoundary>
);

console.log('welcome to the CartoCams');
