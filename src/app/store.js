import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { generateRows } from './helpers';

// export default(initialState) => {
//   return createStore(reducer, composeWithDevTools(
//     applyMiddleware(thunk),
//   ), initialState);
// }

const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    position: {
      type: 'string'
    },
    salary: {
      type: 'integer'
    },
    active: {
      type: 'boolean'
    }
  },
  required: ['id', 'name', 'position', 'salary', 'active']
};

const middleware = applyMiddleware(thunk);

const initialState = generateRows(20, schema );
const store = createStore(reducer, {tables: initialState}, composeWithDevTools(
  middleware,
));

export default store;