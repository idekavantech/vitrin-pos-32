/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from "immer";
import {
  APPLY_CATEGORY,
  SET_BUSINESS,
  SET_DEAL,
  SET_DELIVERIES,
  SET_POS_DEVICES,
} from "./constants";
import { SET_PRINTER_OPTIONS } from "../../src/containers/App/constants";

// The initial state of the App
export const initialState = {
  business: {},
  deliveries: [],
  deliveriesPagination: {},
  printerOptions: {
    title: "",
    website: "",
    phone: "",
    printers: [],
  },
  deal: null,
  devices: null,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_BUSINESS:
        draft.business = action.data;
        break;
      case SET_DELIVERIES:
        draft.deliveries = action.data;
        draft.deliveriesPagination = action.pagination;
        break;
      case SET_PRINTER_OPTIONS:
        draft.printerOptions = action.data;
        break;
      case APPLY_CATEGORY:
        const { category, actionType } = action.data;
        if (actionType === "create")
          draft.business.deal_categories = [
            ...draft.business.deal_categories,
            category,
          ];
        if (actionType === "update") {
          let categoryIndex = draft.business.deal_categories.findIndex(
            (c) => category.id === c.id
          );
          draft.business.deal_categories[categoryIndex] = category;
        }
        if (actionType === "delete") {
          draft.business.deal_categories.splice(
            draft.business.deal_categories.findIndex(
              (c) => category.id === c.id
            ),
            1
          );
        }

        break;
      case SET_DEAL:
        draft.deal = action.data;
        break;
      case SET_POS_DEVICES:
        draft.devices = action.data;
        break;
    }
  });

export default appReducer;
