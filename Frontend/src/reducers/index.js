import { combineReducers } from 'redux';
import validation from './userAuth';
import information from './userInfo';
import groupvalidation from './newGroup';

const rootReducer = combineReducers({
  validation,
  information,
  groupvalidation,
});

export default rootReducer;
