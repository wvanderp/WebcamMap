import * as React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';

import {createStore} from './reducers/rootReducer';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'jquery/dist/jquery.min';
import 'bootstrap/dist/js/bootstrap.min';

import 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import './style/main.sass';

import FourOFour from './components/pages/FourOFour';
import MapView from './components/pages/MapView';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={MapView}/>
            <Route exact path="/WebcamMap/" component={MapView}/>
            <Route component={FourOFour}/>
        </Switch>
    </Router>,
    document.querySelector('#app')
);

// eslint-disable-next-line no-console
console.log('welcome to the Webcam Map');
