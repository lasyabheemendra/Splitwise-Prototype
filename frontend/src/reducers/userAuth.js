import {
  SW_LOGIN_SUCCESS, SW_LOGIN_ERROR, LOGOUT,
  SW_SIGNUP_SUCCESS, SW_SIGNUP_ERROR,
} from '../constants/action_type';

const initialState = {
  loggedIn: null,
  error: '',
  token: '',
};
const validation = (state = initialState, action) => {
  switch (action.type) {
    case SW_LOGIN_SUCCESS:
      return {
        loggedIn: true,
        error: '',
        token: action.token,
      };
    case SW_LOGIN_ERROR:
      return {
        loggedIn: false,
        error: action.error,
        token: '',
      };
    case LOGOUT:
      return {
        loggedIn: false,
      };
    case SW_SIGNUP_SUCCESS:
      return {
        loggedIn: true,
        error: '',
        token: action.token,
      };
    case SW_SIGNUP_ERROR:
      return {
        loggedIn: false,
        error: action.error,
        token: '',
      };
    default:
      return state;
  }
};

export default validation;
