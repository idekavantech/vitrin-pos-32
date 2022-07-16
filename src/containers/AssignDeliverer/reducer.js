/*
 *
 * Admin reducer
 *
 */
import produce from "immer";
import { SET_ADMIN_ORDERS, DEFAULT_ACTION } from "./constants";

export const initialState = {
  orders: [],
  ordersPagination: {},
};

/* eslint-disable default-case, no-param-reassign */
const adminReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ADMIN_ORDERS:
        draft.orders = action.data;
        draft.ordersPagination = action.pagination;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default adminReducer;
