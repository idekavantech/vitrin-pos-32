import {
  TOGGLE_MODAL,
  CLOSE_MODALS,
  CLOSE_DRAWERS,
  TOGGLE_DRAWER,
  SET_UI_PRODUCT,
  SET_UI_POST,
  SET_UI_CATEGORY,
  SET_SNACK_BAR_MESSAGE,
  SET_UI_SHELF,
  SET_UI_ADDRESS,
  RELOAD_PAGE,
} from "./constants";

export function reloadPage() {
  return {
    type: RELOAD_PAGE,
  };
}

export function setUiShelf(id) {
  return {
    type: SET_UI_SHELF,
    data: { id },
  };
}
export function setUiProduct(id) {
  return {
    type: SET_UI_PRODUCT,
    data: { id },
  };
}

export function setUiAddress(id) {
  return {
    type: SET_UI_ADDRESS,
    data: { id },
  };
}

export function setUiPost(id) {
  return {
    type: SET_UI_POST,
    data: { id },
  };
}

export function setUiCategory(id) {
  return {
    type: SET_UI_CATEGORY,
    data: { id },
  };
}

export function toggleModal(modalName, isOpen, closeAll) {
  return {
    type: TOGGLE_MODAL,
    data: { modalName, isOpen, closeAll },
  };
}

export function toggleDrawer(drawerName, isOpen) {
  return {
    type: TOGGLE_DRAWER,
    data: { drawerName, isOpen },
  };
}

export function closeModals() {
  return {
    type: CLOSE_MODALS,
  };
}

export function closeDrawers() {
  return {
    type: CLOSE_DRAWERS,
  };
}

export function setSnackBarMessage(message, messageType) {
  return {
    type: SET_SNACK_BAR_MESSAGE,
    message,
    messageType,
  };
}
