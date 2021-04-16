/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import {
  NEW_GROUP_SUCCESS, NEW_GROUP_ERROR, USER_DETAILS_SUCCESS, NEW_GROUP_RESET,
} from '../constants/action_type';

export const groupCreate = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  axios.post('http://localhost:3001/group/createnew', data)
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: USER_DETAILS_SUCCESS, info: response.data });
        dispatch({ type: NEW_GROUP_SUCCESS });
      }
    }).catch(() => {
      dispatch({ type: NEW_GROUP_ERROR, error: 'Please Enter unique Group Name.' });
    });
};

export const cleargroupProp = () => (dispatch) => {
  dispatch({ type: NEW_GROUP_RESET });
};
