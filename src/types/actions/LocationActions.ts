export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const UPDATE_ZOOM = 'UPDATE_ZOOM';

export interface UPDATE_LOCATION_ACTION {
    type: typeof UPDATE_LOCATION;
    payload: [number, number];
}

export interface UPDATE_ZOOM {
    type: typeof UPDATE_ZOOM;
    payload: number;
}

export type UPDATE_LOCATION_ACTION_ACTIONS = UPDATE_LOCATION_ACTION | UPDATE_ZOOM;
