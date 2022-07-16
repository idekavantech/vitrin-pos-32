/*
 *
 * Admin reducer
 *
 */
import produce from "immer";
import {
  DEFAULT_ACTION,
  SET_ADMIN_ORDER,
  SET_CUSTOMER_ORDERS,
} from "./constants";

export const initialState = {
  adminOrder: { items: [] },
  customerOrders: [],
};

/* eslint-disable default-case, no-param-reassign */
const adminReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ADMIN_ORDER:
        draft.adminOrder = action.data;
        break;
      case SET_CUSTOMER_ORDERS:
        draft.customerOrders = action.data;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default adminReducer;
