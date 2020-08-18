import {combineReducers, createStore as createStoreReal} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import LocationReducer from './LocationReducer';

export const rootReducer = combineReducers(
    {
        location: LocationReducer
    }
);

export type appState = ReturnType<typeof rootReducer>;

export const createStore = () => createStoreReal(rootReducer, {}, composeWithDevTools());
