import { combineReducers } from 'redux';
import validation from './userAuth';
import information from './userInfo';
import groupvalidation from './newGroup';
import groupdetails from './groupAccept';
import groupinformation from './groupInfo';
import mygroups from './myGroups';
import expenseformation from './expenseInfo';
import activitiesInformation from './activitiesInfo';

const rootReducer = combineReducers({
  validation,
  information,
  groupvalidation,
  groupdetails,
  groupinformation,
  mygroups,
  expenseformation,
  activitiesInformation,
});

export default rootReducer;
