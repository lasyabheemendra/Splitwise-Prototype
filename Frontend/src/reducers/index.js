import { combineReducers } from 'redux';
import validation from './userAuth';
import information from './userInfo';
import groupvalidation from './newGroup';
import groupdetails from './groupAccept';
import groupinformation from './groupInfo';

const rootReducer = combineReducers({
  validation,
  information,
  groupvalidation,
  groupdetails,
  groupinformation,
});

export default rootReducer;
