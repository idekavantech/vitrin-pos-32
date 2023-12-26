/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  START_LOADING,
  STOP_LOADING,
  INIT,
  FILE_UPLOADED,
  UPLOAD_FILE,
  REMOVE_FILE,
  CLEAR_UPLOADED_FILES,
  START_INIT_LOADING,
  STOP_INIT_LOADING,
  SET_SITE_DOMAIN,
  SET_BUSINESS_ID,
  MANY_ACTIONS,
  SEND_EMAIL,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  UPLOAD_REQUEST_FINISHED,
  START_PROGRESS_LOADING,
  STOP_PROGRESS_LOADING,
  SET_PRINTER_OPTIONS,
  TOGGLE_HAMI_MODAL,
  ACCEPT_ORDER, SET_FIREBASE_TOKEN, GLOBAL_LOADING_TYPE, GET_SERVER_TIME, SET_SERVER_TIME
} from "./constants";

export function init() {
  return {
    type: INIT,
  };
}

export function callManyActions(actions) {
  return {
    type: MANY_ACTIONS,
    data: actions,
  };
}

export function startLoading(name = GLOBAL_LOADING_TYPE) {
  return {
    type: START_LOADING,
    data: { name },
  };
}

export function stopLoading(name = GLOBAL_LOADING_TYPE) {
  return {
    type: STOP_LOADING,
    data: { name },
  };
}

export function startProgressLoading() {
  return {
    type: START_PROGRESS_LOADING,
  };
}

export function stopProgressLoading() {
  return {
    type: STOP_PROGRESS_LOADING,
  };
}

export function setPrinterOptions(data) {
  localStorage.setItem("printerOptions", JSON.stringify(data));
  return {
    type: SET_PRINTER_OPTIONS,
    data,
  };
}

export function startInitLoading() {
  return {
    type: START_INIT_LOADING,
  };
}

export function stopInitLoading() {
  return {
    type: STOP_INIT_LOADING,
  };
}

export function uploadFile(data, callback) {
  return {
    type: UPLOAD_FILE,
    data,
    callback,
  };
}

export function fileUploaded(data) {
  return {
    type: FILE_UPLOADED,
    data,
  };
}

export function removeFile(data) {
  return {
    type: REMOVE_FILE,
    index: data,
  };
}

export function clearUploadedFiles() {
  return {
    type: CLEAR_UPLOADED_FILES,
  };
}

export function setSiteDomain(siteDomain) {
  return {
    type: SET_SITE_DOMAIN,
    data: siteDomain,
  };
}

export function setBusinessId(businessId) {
  return {
    type: SET_BUSINESS_ID,
    data: businessId,
  };
}
export function sendEmail(data) {
  return {
    type: SEND_EMAIL,
    data,
  };
}

export const uploadRequest = () => ({
  type: UPLOAD_REQUEST,
});
export const uploadRequestFinished = () => ({
  type: UPLOAD_REQUEST_FINISHED,
});
export const uploadProgress = (file, progress) => ({
  type: UPLOAD_PROGRESS,
  payload: progress,
  meta: { file },
});
export const uploadSuccess = (file) => ({
  type: UPLOAD_SUCCESS,
  meta: { file },
});
export const uploadFailure = (file, err) => ({
  type: UPLOAD_FAILURE,
  payload: err,
  error: true,
  meta: { file },
});

export const toggleHamiModal = (show) => ({
  type: TOGGLE_HAMI_MODAL,
  show,
});

export function acceptOrder(data) {
  return {
    type: ACCEPT_ORDER,
    data,
  };
}

export function setServerTime(data) {
  return {
    type: SET_SERVER_TIME,
    data,
  };
}
export function setFirebaseToken(data) {
  return {
    type: SET_FIREBASE_TOKEN,
    data,
  };
}
