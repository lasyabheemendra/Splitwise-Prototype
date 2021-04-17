/* eslint-disable no-underscore-dangle */
import {
  ACCEPT_GROUP_ERROR,
} from '../constants/action_type';

const initialState = {
  acceptederror: false,
};

const groupdetails = (state = initialState, action) => {
  switch (action.type) {
    case ACCEPT_GROUP_ERROR:
      return {
        acceptederror: true,
      };
    default:
      return state;
  }
};

export default groupdetails;
