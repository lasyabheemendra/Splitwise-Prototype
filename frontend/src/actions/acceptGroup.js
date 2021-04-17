/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import {
  USER_DETAILS_SUCCESS, ACCEPT_GROUP_ERROR,
} from '../constants/action_type';

export const acceptGroup = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  console.log('before', data);
  axios.post('http://localhost:3001/mygroups/accept', data)
    .then((response) => {
      if (response.status === 200) {
        console.log('acceptedgropu respnse', response);
        dispatch({ type: USER_DETAILS_SUCCESS, info: response.data });
      }
    }).catch(() => {
      dispatch({ type: ACCEPT_GROUP_ERROR });
    });
};

export default acceptGroup;
