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
  FILE_UPLOADED,
  REMOVE_FILE,
  START_LOADING,
  STOP_LOADING,
  CLEAR_UPLOADED_FILES,
  START_INIT_LOADING,
  STOP_INIT_LOADING,
  SET_SITE_DOMAIN,
  SET_BUSINESS_ID,
  UPLOAD_PROGRESS,
  UPLOAD_REQUEST,
  UPLOAD_REQUEST_FINISHED,
  START_PROGRESS_LOADING,
  STOP_PROGRESS_LOADING,
  TOGGLE_HAMI_MODAL, SET_FIREBASE_TOKEN, SET_SERVER_TIME,
} from "./constants";

// The initial state of the App
export const initialState = {
  loading: {
    global: false,
  },
  progressLoading: false,
  initLoading: true,
  error: false,
  user: null,
  uploadedFile: null,
  uploadProgress: null,
  uploadStarted: false,
  subdomain: "",
  businessId: null,
  multipleUploadedFiles: [],
  hamiModal: false,
  firebaseToken: "",
  serverTime: null
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case START_LOADING:
        draft.loading[action.data.name] = true;
        break;

      case STOP_LOADING:
        draft.loading[action.data.name] = false;
        break;
      case START_PROGRESS_LOADING:
        draft.progressLoading = true;
        break;

      case STOP_PROGRESS_LOADING:
        draft.progressLoading = false;
        break;
      case START_INIT_LOADING:
        draft.initLoading = true;
        break;

      case STOP_INIT_LOADING:
        draft.initLoading = false;
        break;

      case UPLOAD_REQUEST:
        draft.uploadStarted = true;
        break;
      case UPLOAD_REQUEST_FINISHED:
        draft.uploadStarted = false;
        break;
      case UPLOAD_PROGRESS:
        draft.uploadProgress = action.payload;
        break;
      case FILE_UPLOADED:
        draft.uploadedFile = action.data;
        draft.multipleUploadedFiles.unshift(action.data);
        break;

      case REMOVE_FILE:
        draft.uploadedFile = null;
        if (action.index > -1) {
          const uploadedFiles = [...draft.multipleUploadedFiles];
          uploadedFiles.splice(action.index, 1);
          draft.multipleUploadedFiles = uploadedFiles;
        } else {
          draft.multipleUploadedFiles = [];
        }
        break;
      case CLEAR_UPLOADED_FILES:
        draft.uploadedFile = null;
        draft.multipleUploadedFiles = [];
        break;
      case SET_SITE_DOMAIN:
        draft.subdomain = action.data;
        break;
      case SET_BUSINESS_ID:
        draft.businessId = action.data;
        break;
      case SET_FIREBASE_TOKEN:
        draft.firebaseToken = action.data;
        break;
      case SET_SERVER_TIME:
        draft.serverTime = action.data;
        break;
      case TOGGLE_HAMI_MODAL:
        draft.hamiModal = action.show;
        break;
    }
  });

export default appReducer;
