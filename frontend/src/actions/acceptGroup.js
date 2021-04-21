import axios from 'axios';
import {
  USER_GROUP_SUCCESS, ACCEPT_GROUP_ERROR,
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

export default acceptGroup;
