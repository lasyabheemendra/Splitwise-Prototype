/* eslint-disable no-underscore-dangle */
import {
  EXPENSE_INFO_SUCCESS, EXPENSE_INFO_ERROR,
} from '../constants/action_type';

const initialState = {
  expenses: '',
  error: '',
};

const expenseformation = (state = initialState, action) => {
  switch (action.type) {
    case EXPENSE_INFO_SUCCESS:
      return {
        expenses: action.info,
        error: '',
      };
    case EXPENSE_INFO_ERROR:
      return {
        error: action.error,
      };
    default:
      return state;
  }
};

export default expenseformation;
