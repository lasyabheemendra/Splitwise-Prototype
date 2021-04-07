/* eslint-disable no-underscore-dangle */
import {
  USER_DETAILS_SUCCESS, USER_DETAILS_ERROR,
} from '../constants/action_type';

const initialState = {
  useremail: '',
  username: '',
  phone: '',
  currency: '',
  timezone: '',
  language: '',
  image: '',
  invitedGroups: [],
  acceptedGroups: [],
  error: '',
};

const information = (state = initialState, action) => {
  switch (action.type) {
    case USER_DETAILS_SUCCESS:
      return {
        userID: action.info._id,
        useremail: action.info.useremail,
        username: action.info.username,
        phonenumber: action.info.phonenumber,
        currency: action.info.currency,
        timezone: action.info.timezone,
        language: action.info.language,
        image: '',
        invitedGroups: action.info.invitedGroups,
        acceptedGroups: action.info.acceptedGroups,
      };
    case USER_DETAILS_ERROR:
      return {
        error: action.error,
      };
    default:
      return state;
  }
};

export default information;
