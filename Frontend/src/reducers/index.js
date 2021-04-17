import { combineReducers } from 'redux';
import validation from './userAuth';
import information from './userInfo';
import groupvalidation from './newGroup';
import groupdetails from './groupAccept';

const rootReducer = combineReducers({
  validation,
  information,
  groupvalidation,
  groupdetails,
});

export default rootReducer;
