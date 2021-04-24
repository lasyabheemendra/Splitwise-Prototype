/* eslint-disable no-underscore-dangle */
import {
  USER_GROUP_SUCCESS, USER_GROUP_ERROR, LEAVE_GROUP_SUCCESS, LEAVE_GROUP_ERROR, LEAVE_GROUP_RESET,
} from '../constants/action_type';

const initialState = {
  acceptedGroups: [],
  error: '',
  leavegroup: false,
};

const mygroups = (state = initialState, action) => {
  switch (action.type) {
    case USER_GROUP_SUCCESS:
      return {
        acceptedGroups: action.groups,
      };
    case USER_GROUP_ERROR:
      return {
        error: action.error,
      };
    case LEAVE_GROUP_SUCCESS:
      return {
        leavegroup: true,
        error: '',
      };
    case LEAVE_GROUP_ERROR:
      return {
        leavegroup: false,
        error: action.error,
      };
    case LEAVE_GROUP_RESET:
      return {
        leavegroup: false,
        error: '',
      };
    default:
      return state;
  }
};

export default mygroups;
