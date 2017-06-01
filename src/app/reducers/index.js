import { combineReducers } from 'redux';
import environment from './environment';
import tables from './tables';
import dndtables from './dndtables';

const rootReducer = combineReducers({
  environment,
  tables,
  dndtables
});

export default rootReducer;