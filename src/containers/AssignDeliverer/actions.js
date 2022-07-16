/*
 *
 * Admin actions
 *
 */

import {
  SET_ADMIN_ORDERS,
  DEFAULT_ACTION,
  GET_ADMIN_ORDERS,
  SET_DELIVERERS,
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAdminOrders(page, hasDeliverer) {
  return {
    type: GET_ADMIN_ORDERS,
    data: { page, hasDeliverer },
  };
}

export function setAdminOrders(data, pagination) {
  return {
    type: SET_ADMIN_ORDERS,
    data,
    pagination,
  };
}
export function setDeliverers(data) {
  return {
    type: SET_DELIVERERS,
    data,
  };
}
