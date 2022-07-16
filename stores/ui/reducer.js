/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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
  TOGGLE_MODAL,
  CLOSE_MODALS,
  CLOSE_DRAWERS,
  TOGGLE_DRAWER,
  LOGIN_MODAL,
  VERIFICATION_MODAL,
  SET_UI_PRODUCT,
  SET_UI_POST,
  ADMIN_MENU,
  ADMIN_FONT_SELECTION_MODAL,
  ADMIN_ADD_NEW_CATEGORY_ITEM_MODAL,
  ADMIN_ADD_NEW_POST_MODAL,
  ADMIN_ADD_NEW_PRODUCT_MODAL,
  ADMIN_EDIT_ABOUT_US_MODAL,
  ADMIN_EDIT_DESCRIPTION_MODAL,
  ADMIN_EDIT_SOCIAL_MEDIAS_MODAL,
  ADMIN_EDIT_WORKING_HOURS_MODAL,
  ADMIN_EDIT_WORKING_HOURS_SECTION_MODAL,
  ADMIN_EDIT_ADDRESS_MODAL,
  ADMIN_EDIT_POSTS_SECTION_MODAL,
  ADMIN_EDIT_SLIDER_SECTION_MODAL,
  ADMIN_EDIT_BUSINESS_CONTACT_INFO_MODAL,
  ADMIN_THEME_SELECTION_MODAL,
  ADMIN_THEME_COLOR_MODAL,
  ADMIN_EDIT_CATEGORY_ITEM_MODAL,
  SET_UI_CATEGORY,
  ADMIN_EDIT_PRODUCT_MODAL,
  ADMIN_EDIT_POST_MODAL,
  SET_SNACK_BAR_MESSAGE,
  ADMIN_EDIT_SHELF_MODAL,
  SET_UI_SHELF,
  DEALS_PRODUCT_MODAL,
  ECOMMERCE_PRODUCT_MODAL,
  SET_UI_ADDRESS,
} from "./constants";

// The initial state of the App
export const initialState = {
  modals: {
    [LOGIN_MODAL]: false,
    [VERIFICATION_MODAL]: false,
    [DEALS_PRODUCT_MODAL]: false,
    [ECOMMERCE_PRODUCT_MODAL]: false,
    [ADMIN_FONT_SELECTION_MODAL]: false,
    [ADMIN_THEME_COLOR_MODAL]: false,
    [ADMIN_THEME_SELECTION_MODAL]: false,
    [ADMIN_ADD_NEW_CATEGORY_ITEM_MODAL]: false,
    [ADMIN_ADD_NEW_POST_MODAL]: false,
    [ADMIN_EDIT_POST_MODAL]: false,
    [ADMIN_ADD_NEW_PRODUCT_MODAL]: false,
    [ADMIN_EDIT_PRODUCT_MODAL]: false,
    [ADMIN_EDIT_ABOUT_US_MODAL]: false,
    [ADMIN_EDIT_DESCRIPTION_MODAL]: false,
    [ADMIN_EDIT_SOCIAL_MEDIAS_MODAL]: false,
    [ADMIN_EDIT_WORKING_HOURS_MODAL]: false,
    [ADMIN_EDIT_WORKING_HOURS_SECTION_MODAL]: false,
    [ADMIN_EDIT_ADDRESS_MODAL]: false,
    [ADMIN_EDIT_POSTS_SECTION_MODAL]: false,
    [ADMIN_EDIT_SLIDER_SECTION_MODAL]: false,
    [ADMIN_EDIT_BUSINESS_CONTACT_INFO_MODAL]: false,
    [ADMIN_EDIT_CATEGORY_ITEM_MODAL]: false,
    [ADMIN_EDIT_SHELF_MODAL]: false,
  },
  drawers: {
    [ADMIN_MENU]: false,
  },
  product: null,
  post: null,
  category: null,
  shelf: null,
  address: null,
  snackBarMessage: {},
};
/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_UI_SHELF:
        draft.shelf = action.data.id;
        break;
      case SET_UI_PRODUCT:
        draft.product = action.data.id;
        break;
      case SET_UI_POST:
        draft.post = action.data.id;
        break;
      case SET_UI_CATEGORY:
        draft.category = action.data.id;
        break;
      case SET_UI_ADDRESS:
        draft.address = action.data.id;
        break;
      case TOGGLE_MODAL:
        if (action.data.closeAll) {
          for (const modal in draft.modals) {
            draft.modals[modal] = false;
          }
          draft.product = null;
          draft.post = null;
          draft.category = null;
          draft.shelf = null;
          draft.address = null;
        }
        draft.modals[action.data.modalName] = action.data.isOpen;
        break;
      case CLOSE_MODALS:
        for (const modal in draft.modals) {
          draft.modals[modal] = false;
        }
        draft.product = null;
        draft.post = null;
        draft.category = null;
        draft.shelf = null;
        draft.address = null;
        break;
      case TOGGLE_DRAWER:
        for (const drawer in draft.drawers) {
          draft.drawers[drawer] = false;
        }
        draft.drawers[action.data.drawerName] = action.data.isOpen;
        break;
      case CLOSE_DRAWERS:
        for (const drawer in draft.drawers) {
          draft.drawers[drawer] = false;
        }
        draft.product = null;
        draft.post = null;
        draft.category = null;
        break;
      case SET_SNACK_BAR_MESSAGE:
        draft.snackBarMessage = {
          message: action.message,
          type: action.messageType,
        };
        break;
    }
  });

export default appReducer;
