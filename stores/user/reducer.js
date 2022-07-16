/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from "immer";
import {
  SET_USER,
  SET_ADMIN,
  SET_TOKEN,
  SET_LOGIN_CALLBACK,
  SET_BUSINESSES,
} from "./constants";

// The initial state of the App
export const initialState = {
  user: null,
  token: null,
  businesses: null,
  loginCallBack: () => {},
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER:
        draft.user = action.data;
        break;
      case SET_ADMIN:
        draft.user = { ...draft.user, isAdmin: action.data.is_admin };
        break;
      case SET_TOKEN:
        draft.token = action.data.token;
        break;
      case SET_LOGIN_CALLBACK:
        draft.loginCallBack = action.data;
        break;
      case SET_BUSINESSES:
        draft.businesses = action.data;
        break;
    }
  });

export default appReducer;
