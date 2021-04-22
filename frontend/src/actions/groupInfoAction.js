/* eslint-disable no-console */
import axios from 'axios';
import {
  GROUP_INFO_SUCCESS, GROUP_INFO_ERROR, EXPENSE_INFO_SUCCESS, EXPENSE_INFO_ERROR,
} from '../constants/action_type';

export const getMemberInfo = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  axios.post('http://localhost:3001/groups/memberinfo', data)
    .then((response) => {
      if (response.status === 200) {
        console.log('getMemberInfo respnse groupinfoAction', response.data);
        dispatch({ type: GROUP_INFO_SUCCESS, info: response.data.info });
      }
    }).catch(() => {
      dispatch({ type: GROUP_INFO_ERROR, error: 'Group Information is not updated' });
    });
};

export const getexpenseInfo = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  axios.post('http://localhost:3001/groups/expenseinfo', data)
    .then((response) => {
      if (response.status === 200) {
        console.log('getexpense respnse 2', response.data.info.expenses);
        dispatch({ type: EXPENSE_INFO_SUCCESS, info: response.data.info.expenses });
      }
    }).catch(() => {
      dispatch({ type: EXPENSE_INFO_ERROR, error: 'Expense Information is not updated' });
    });
};
