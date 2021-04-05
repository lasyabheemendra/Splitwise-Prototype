import { combineReducers } from 'redux';
import validation from './userAuth';
import information from './userInfo';

const rootReducer = combineReducers({
  validation,
  information,
});

export default rootReducer;
