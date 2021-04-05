import axios from 'axios';
import {
  SW_LOGIN_SUCCESS, SW_LOGIN_ERROR, LOGOUT, USER_DETAILS_SUCCESS,
} from '../constants/action_type';

export const login = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.withCredentials = true;
  // make a post request with the user data
  axios.post('http://localhost:3001/user/login', data)
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: SW_LOGIN_SUCCESS, token: response.data.token });
        dispatch({ type: USER_DETAILS_SUCCESS, info: response.data.info });
      }
    }).catch(() => {
      dispatch({ type: SW_LOGIN_ERROR, error: 'Incorrect user email or password.' });
    });
};
export const logout = () => {
  localStorage.clear();
  return { type: LOGOUT };
};
