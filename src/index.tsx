import * as React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

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
import PlaceSitemapPage from './components/sitemap/PlaceSitemap';
import WebcamsSitemapPage from './components/sitemap/WebcamsSitemap';

ReactDOM.render(
    <Router>
        <Menu />
        <Switch>
            <Route exact path="/" component={MapView}/>

            <Route exact path="/country/:name" component={ListPage}/>
            <Route exact path="/state/:name" component={ListPage}/>
            <Route exact path="/county/:name" component={ListPage}/>
            <Route exact path="/city/:name" component={ListPage}/>

            <Route exact path="/webcam/:id" component={WebcamPage}/>

            <Route exact path="/webcams/" component={WebcamsSitemapPage}/>
            <Route exact path="/places/" component={PlaceSitemapPage}/>

            <Route component={FourOFour}/>
        </Switch>
    </Router>,
    document.querySelector('#app')
);

// eslint-disable-next-line no-console
console.log('welcome to the CartoCams');
