/* eslint-disable prettier/prettier */
import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the admin state domain
 */

const selectAnalytics = (state) => state.Analytics || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Admin
 */

const makeSelectAnalytics = () =>
  createSelector(selectAnalytics, (substate) => substate);
const makeSelectAnalyticsData = () =>
  createSelector(selectAnalytics, (state) => state.data);

export default makeSelectAnalytics;
export { makeSelectAnalytics, makeSelectAnalyticsData };
