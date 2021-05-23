import {combineReducers, createStore as createStoreReal, Store} from 'redux';
import LocationReducer from './LocationReducer';

export const rootReducer = combineReducers(
    {
        location: LocationReducer
    }
);

export type appState = ReturnType<typeof rootReducer>;

export const createStore = (): Store<typeof rootReducer> => createStoreReal(rootReducer, {});
