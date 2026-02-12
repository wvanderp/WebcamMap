import { createGlobalState } from 'react-hooks-global-state';

interface defaultStateType{
    location: {
        coordinates: [number, number],
        zoom: number
    }
}

const defaultState: defaultStateType = {
	location: {
		coordinates: [0, 0],
		zoom: 2
	}
};

const { useGlobalState } = createGlobalState(defaultState);

export default useGlobalState;
