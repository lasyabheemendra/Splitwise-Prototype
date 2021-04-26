/* eslint-disable no-console */
import axios from 'axios';
import {
  SW_LOGIN_SUCCESS, SW_LOGIN_ERROR, LOGOUT, USER_DETAILS_SUCCESS, USER_GROUP_SUCCESS,
} from '../constants/action_type';

export const login = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.withCredentials = true;
  // make a post request with the user data
  axios.post('http://localhost:3001/user/login', data)
    .then(async (response) => {
      if (response.status === 200) {
        await dispatch({ type: USER_DETAILS_SUCCESS, info: response.data.info });
        await dispatch({ type: SW_LOGIN_SUCCESS, token: response.data.token });
        await dispatch({ type: USER_GROUP_SUCCESS, groups: response.data.groups });
      }
    }).catch(() => {
      dispatch({ type: SW_LOGIN_ERROR, error: 'Incorrect user email or password.' });
    });
};
export const logout = () => {
  localStorage.clear();
  return { type: LOGOUT };
};
