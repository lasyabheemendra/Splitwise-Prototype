/* eslint-disable no-underscore-dangle */
import {
  RECENT_ACTIVITIES_SUCCESS, RECENT_ACTIVITIES_ERROR,
} from '../constants/action_type';

const initialState = {
  activities: [],
  error: '',
};

const activitiesInformation = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_ACTIVITIES_SUCCESS:
      return {
        activities: action.activities,
        error: '',
      };
    case RECENT_ACTIVITIES_ERROR:
      return {
        error: action.error,
      };
    default:
      return state;
  }
};

export default activitiesInformation;
