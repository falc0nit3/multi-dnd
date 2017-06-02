import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
//import { generateRows } from './helpers';

// export default(initialState) => {
//   return createStore(reducer, composeWithDevTools(
//     applyMiddleware(thunk),
//   ), initialState);
// }


const middleware = applyMiddleware(thunk);
const store = createStore(reducer, {}, composeWithDevTools(
  middleware,
));

export default store;