/*
 *
 * Admin actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_CATEGORY_ORDER,
  SET_DEALS,
  GET_DEALS,
  GET_UNAVAILABLE_DEALS,
  SET_UNAVAILABLE_DEALS,
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changeCategoryOrder(id, newIndex) {
  return {
    type: CHANGE_CATEGORY_ORDER,
    data: {
      id,
      newIndex,
    },
  };
}

export function getDeals(data) {
  return {
    type: GET_DEALS,
    data,
  };
}
export function setDeals(data, pagination) {
  return {
    type: SET_DEALS,
    data,
    pagination,
  };
}
export function getUnavailableDeals(data) {
  return {
    type: GET_UNAVAILABLE_DEALS,
    data,
  };
}
export function setUnavailableDeals(data, pagination) {
  return {
    type: SET_UNAVAILABLE_DEALS,
    data,
    pagination,
  };
}
