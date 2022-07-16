/* eslint-disable prettier/prettier */
/*
 *
 * Admin reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, SET_ANALYTICS_DATA } from './constants';

export const initialState = {
  data: null,
};

/* eslint-disable default-case, no-param-reassign */
const adminReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ANALYTICS_DATA:
        draft.data = action.data;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default adminReducer;
