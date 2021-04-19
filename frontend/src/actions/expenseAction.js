/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import {
  GROUP_INFO_SUCCESS, GROUP_INFO_ERROR,
} from '../constants/action_type';

export const addExpense = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  axios.post('http://localhost:3001/expense/addexpense', data)
    .then((response) => {
      if (response.status === 200) {
        console.log('addExpense response 2', response.data);
        dispatch({ type: GROUP_INFO_SUCCESS, info: response.data.info });
      }
    }).catch(() => {
      dispatch({ type: GROUP_INFO_ERROR, error: 'Group Expense Information is not updated' });
    });
};

export default addExpense;
