/*
 *
 * Admin reducer
 *
 */
import produce from "immer";
import {
  DEFAULT_ACTION,
  SET_DEAL,
  SET_DEALS,
  SET_UNAVAILABLE_DEALS,
} from "./constants";

export const initialState = {
  filteredDeals: null,
  filteredDealsPagination: {},
  unavailableDeals: null,
  unavailableDealsPagination: {},
};

/* eslint-disable default-case, no-param-reassign */
const adminReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_DEALS:
        draft.filteredDeals = action.data;
        draft.filteredDealsPagination = action.pagination;
        break;
      case SET_UNAVAILABLE_DEALS:
        draft.unavailableDeals = action.data;
        draft.unavailableDealsPagination = action.pagination;
        break;
    }
  });

export default adminReducer;
