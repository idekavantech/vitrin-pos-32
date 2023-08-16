/*
 *
 * Admin actions
 *
 */

import {
  SET_ADMIN_ORDERS,
  DEFAULT_ACTION,
  GET_ADMIN_ORDERS,
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAdminOrders(data, businessId) {
  return {
    type: GET_ADMIN_ORDERS,
    data,
    businessId
  };
}

export function setAdminOrders(data, pagination) {
  return {
    type: SET_ADMIN_ORDERS,
    data,
    pagination,
  };
}
