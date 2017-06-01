import * as AT from '../constants/ActionTypes';

const initialState = {
  fetching: false,
  fetched: false,
  error: '',
};

export default function environment(state = initialState, action) {
  switch (action.type) {
    case AT.INIT_ENV: {
      return {
        ...state,
        fetching: true,
        fetched: false
      }
    }
    default:
      return state;
  }
}