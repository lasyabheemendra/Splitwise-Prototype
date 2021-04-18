/* eslint-disable no-underscore-dangle */
import {
  GROUP_INFO_SUCCESS, GROUP_INFO_ERROR,
} from '../constants/action_type';

const initialState = {
  groupName: '',
  numberOfMembers: '',
  members: '',
  expenses: '',
  error: '',
};

const groupinformation = (state = initialState, action) => {
  switch (action.type) {
    case GROUP_INFO_SUCCESS:
      return {
        groupName: action.info.groupName,
        numberOfMembers: action.info.numberOfMembers,
        members: action.info.members,
        expenses: action.info.expenses,
        error: '',
      };
    case GROUP_INFO_ERROR:
      return {
        error: action.error,
      };
    default:
      return state;
  }
};

export default groupinformation;
