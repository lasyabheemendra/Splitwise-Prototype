/* eslint-disable no-underscore-dangle */
import {
  USER_GROUP_SUCCESS, USER_GROUP_ERROR,
} from '../constants/action_type';

const initialState = {
  acceptedGroups: [],
  error: '',
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
    default:
      return state;
  }
};

export default mygroups;
