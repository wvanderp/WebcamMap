import * as React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import Menu from './components/parts/Menu';
import PlaceSitemapPage from './components/sitemap/PlaceSitemap';
import WebcamsSitemapPage from './components/sitemap/WebcamsSitemap';
import WebcamsSitemap from './components/sitemap/WebcamsSitemap';

import {createStore} from './reducers/RootReducer';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'jquery/dist/jquery.min';
import 'bootstrap/dist/js/bootstrap.min';

import 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import './style/main.sass';

import FourOFour from './components/pages/FourOFour';
import MapView from './components/pages/MapView';
import ListPage from './components/pages/ListPage';
import WebcamPage from './components/pages/WebcamPage';

ReactDOM.render(
    <Provider store={createStore()}>
        <Menu />
        <Router>
            <Switch>
                <Route exact path="/" component={MapView}/>
                <Route exact path="/WebcamMap/" component={MapView}/>

                <Route exact path="/WebcamMap/country/:name" component={ListPage}/>
                <Route exact path="/WebcamMap/state/:name" component={ListPage}/>
                <Route exact path="/WebcamMap/county/:name" component={ListPage}/>
                <Route exact path="/WebcamMap/city/:name" component={ListPage}/>

                <Route exact path="/WebcamMap/webcam/:id" component={WebcamPage}/>

                <Route exact path="/WebcamMap/webcams/" component={WebcamsSitemapPage}/>
                <Route exact path="/WebcamMap/places/" component={PlaceSitemapPage}/>

                <Route component={FourOFour}/>
            </Switch>
        </Router>
    </Provider>,
    document.querySelector('#app')
);

// eslint-disable-next-line no-console
console.log('welcome to the Webcam Map');
