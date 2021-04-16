import {
  NEW_GROUP_SUCCESS, NEW_GROUP_ERROR, NEW_GROUP_RESET,
} from '../constants/action_type';

const initialState = {
  groupcreated: null,
  error: '',
};

const groupvalidation = (state = initialState, action) => {
  switch (action.type) {
    case NEW_GROUP_SUCCESS:
      return {
        groupcreated: true,
        error: '',
      };
    case NEW_GROUP_ERROR:
      return {
        groupcreated: false,
        error: action.error,
      };
    case NEW_GROUP_RESET:
      return {
        groupcreated: false,
        error: '',
      };

    default:
      return state;
  }
};

export default groupvalidation;
