import axios from 'axios';
import {
  USER_DETAILS_SUCCESS, USER_DETAILS_ERROR,
} from '../constants/action_type';

export const userProfilePictureUpdate = (data) => (dispatch) => {
  // set the with credentials to true
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  // make a post request with the user data
  axios.post('http://localhost:3001/user/profileimageupload', data)
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: USER_DETAILS_SUCCESS, info: response.data });
      }
    }).catch(() => {
      dispatch({ type: USER_DETAILS_ERROR, error: 'User Information NOT updated' });
    });
};

export default userProfilePictureUpdate;
