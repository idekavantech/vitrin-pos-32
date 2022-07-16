/**
 * The global state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectUser = (state) => state.user || initialState;

const makeSelectUser = () => createSelector(selectUser, (state) => state.user);

const makeSelectToken = () => createSelector(selectUser, (state) => state.user);

const makeSelectIsAuthenticated = () =>
  createSelector(selectUser, (state) => Boolean(state.user));

const makeSelectLoginCallBack = () =>
  createSelector(selectUser, (state) => state.loginCallBack);
const makeSelectBusinesses = () =>
  createSelector(selectUser, (state) => state.businesses);

export {
  makeSelectBusinesses,
  makeSelectUser,
  makeSelectToken,
  makeSelectIsAuthenticated,
  makeSelectLoginCallBack,
};
