/* eslint-disable no-console */
import axios from 'axios';
import {
  USER_GROUP_SUCCESS, ACCEPT_GROUP_ERROR, LEAVE_GROUP_SUCCESS, LEAVE_GROUP_ERROR, LEAVE_GROUP_RESET,
} from '../constants/action_type';

export const acceptGroup = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  axios.post('http://localhost:3001/mygroups/accept', data)
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: USER_GROUP_SUCCESS, groups: response.data.groups });
      }
    }).catch(() => {
      dispatch({ type: ACCEPT_GROUP_ERROR });
    });
};

export const leaveGroup = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  axios.post('http://localhost:3001/mygroups/leavegroup', data)
    .then((response) => {
      if (response.status === 200) {
        console.log('getexpense respnse 2', response.data);
        dispatch({ type: USER_GROUP_SUCCESS, groups: response.data.groups });
        dispatch({ type: LEAVE_GROUP_SUCCESS });
      }
    }).catch(() => {
      dispatch({ type: LEAVE_GROUP_ERROR, error: 'Please clear your due before leaving group' });
    });
};

export const clearleaveProp = () => (dispatch) => {
  dispatch({ type: LEAVE_GROUP_RESET });
};
