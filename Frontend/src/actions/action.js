/* eslint-disable no-console */
import axios from 'axios';
import { SW_LOGIN_SUCCESS, SW_LOGIN_ERROR, LOGOUT } from '../constants/action_type';

const login = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.withCredentials = true;
  // make a post request with the user data
  axios.post('http://54.215.128.119:3001/login', data)
    .then((response) => {
      console.log('Status Code : ', response.status);
      if (response.status === 200) {
        dispatch({ type: SW_LOGIN_SUCCESS });
      }
    }).catch(() => {
      dispatch({ type: SW_LOGIN_ERROR, error: 'Incorrect user email or password.' });
    });
};
export const logout = () => {
  axios.defaults.withCredentials = true;
  axios.post('http://54.215.128.119:3001/logout');
  return { type: LOGOUT };
};

export default login;
