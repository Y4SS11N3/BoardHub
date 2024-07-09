import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import authReducer from './reducers/authReducer';
import boardReducer from './reducers/boardReducer';
import cardReducer from './reducers/cardReducer';
import userReducer from './reducers/userReducer';
import collaborationReducer from './reducers/collaborationReducer';
import folderReducer from './reducers/folderReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  board: boardReducer,
  card: cardReducer,
  user: userReducer,
  collaboration: collaborationReducer,
  folder: folderReducer
});

// Create the Redux store
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;