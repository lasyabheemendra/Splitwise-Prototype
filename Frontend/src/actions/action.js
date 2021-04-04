/* eslint-disable no-console */
import axios from 'axios';
import { SW_LOGIN_SUCCESS, SW_LOGIN_ERROR, LOGOUT } from '../constants/action_type';

const login = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.withCredentials = true;
  // make a post request with the user data
  axios.post('http://localhost:3001/user/login', data)
    .then((response) => {
      console.log('Status Code : ', response);
      console.log('token Code : ', response.data);
      if (response.status === 200) {
        dispatch({ type: SW_LOGIN_SUCCESS, token: response.data });
      }
    }).catch(() => {
      dispatch({ type: SW_LOGIN_ERROR, error: 'Incorrect user email or password.' });
    });
};
export const logout = () => {
  axios.defaults.withCredentials = true;
  axios.post('http://localhost:3001/logout');
  return { type: LOGOUT };
};

export default login;
