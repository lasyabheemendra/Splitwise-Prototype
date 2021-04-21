/* eslint-disable no-console */
import axios from 'axios';
import {
  SW_LOGIN_ERROR, USER_DETAILS_SUCCESS, USER_GROUP_SUCCESS,
} from '../constants/action_type';

export const getDashboardInfo = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.withCredentials = true;
  // make a post request with the user data
  axios.post('http://localhost:3001/dashboard/getdata', data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('dashboard directly 1', response.data);
        await dispatch({ type: USER_DETAILS_SUCCESS, info: response.data.info });
        await dispatch({ type: USER_GROUP_SUCCESS, groups: response.data.groups });
      }
    }).catch(() => {
      dispatch({ type: SW_LOGIN_ERROR, error: 'Incorrect user email or password.' });
    });
};

export default getDashboardInfo;
