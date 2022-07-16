/* eslint-disable prettier/prettier */
/*
 *
 * Admin actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ANALYTICS_DATA,
  SET_ANALYTICS_DATA,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAnalyticsData(data) {
  return {
    type: GET_ANALYTICS_DATA,
    data,
  };
}

export function setAnalyticsData(data) {
  return {
    type: SET_ANALYTICS_DATA,
    data,
  };
}
