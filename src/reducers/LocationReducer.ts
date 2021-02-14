import {Dispatch} from 'redux';
import {
    UPDATE_LOCATION,
    UPDATE_LOCATION_ACTION_ACTIONS,
    UPDATE_ZOOM
} from '../types/actions/LocationActions';

const defaultState = {
    coordinates: [0, 0],
    zoom: 1
};

export default (state = defaultState, action?: UPDATE_LOCATION_ACTION_ACTIONS): typeof defaultState => {
    switch (action?.type) {
        case UPDATE_LOCATION:
            return {
                ...state,
                coordinates: action.payload
            };
        case UPDATE_ZOOM:
            return {
                ...state,
                zoom: action.payload
            };
        default:
            break;
    }
    return state;
};

// actions
export const updateLocation = (location: [number, number], dispatch: Dispatch): void => {
    dispatch({type: UPDATE_LOCATION, payload: location});
};

export const updateZoom = (zoom: number, dispatch: Dispatch): void => {
    dispatch({type: UPDATE_ZOOM, payload: zoom});
};
