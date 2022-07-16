/*
 *
 * Admin actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ADMIN_ORDER,
  SET_ADMIN_ORDER,
  CANCEL_ORDER,
  REQUEST_ALOPEYK,
  REQUEST_MIARE,
  SET_CUSTOMER_ORDERS,
  GET_CUSTOMER_ORDERS,
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAdminOrder(data) {
  return {
    type: GET_ADMIN_ORDER,
    data,
  };
}
export function requestAlopeyk(order_id) {
  return {
    type: REQUEST_ALOPEYK,
    data: { order_id },
  };
}
export function requestMiare(order_id) {
  return {
    type: REQUEST_MIARE,
    data: { order_id },
  };
}

export function setAdminOrder(data) {
  return {
    type: SET_ADMIN_ORDER,
    data,
  };
}


export function cancelOrder(data) {
  return {
    type: CANCEL_ORDER,
    data,
  };
}

export function getCustomerOrders(userId) {
  return {
    type: GET_CUSTOMER_ORDERS,
    data: { userId },
  };
}

export function setCustomerOrders(data) {
  return {
    type: SET_CUSTOMER_ORDERS,
    data,
  };
}
