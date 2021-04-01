import { combineReducers } from 'redux';
import validation from './userAuth';

const rootReducer = combineReducers({
  validation,
});

export default rootReducer;
