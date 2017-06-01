import { combineReducers } from 'redux';
import environment from './environment';
import tables from './tables';

const rootReducer = combineReducers({
  environment,
  tables
});

export default rootReducer;