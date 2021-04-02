/* eslint-disable no-console */
import axios from 'axios';
import { SW_SIGNUP_SUCCESS, SW_SIGNUP_ERROR } from '../constants/action_type';

const signup = (data) => (dispatch) => {
  console.log('inside action');
  const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  if (!pattern.test(data.useremail)) {
    console.log('data.useremail');
    dispatch({ type: SW_SIGNUP_ERROR, error: 'Please enter valid email address.' });
  } else {
    // set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios.post('http://localhost:3001/signup', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          dispatch({ type: SW_SIGNUP_SUCCESS });
        }
      }).catch(() => {
        dispatch({ type: SW_SIGNUP_ERROR, error: 'This email Id is already registered. Please enter different email address' });
      });
  }
};

export default signup;
