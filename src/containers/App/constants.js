/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const INIT = "vitrin/App/INIT";
export const START_LOADING = "vitrin/App/START_LOADING";
export const STOP_LOADING = "vitrin/App/STOP_LOADING";
export const START_PROGRESS_LOADING = "vitrin/App/START_PROGRESS_LOADING";
export const STOP_PROGRESS_LOADING = "vitrin/App/STOP_PROGRESS_LOADING";
export const START_INIT_LOADING = "vitrin/App/START_INIT_LOADING";
export const STOP_INIT_LOADING = "vitrin/App/STOP_INIT_LOADING";
export const CLEAR_UPLOADED_FILES = "vitrin/App/CLEAR_UPLOADED_FILES";
export const UPLOAD_FILE = "vitrin/App/UPLOAD_FILE";
export const FILE_UPLOADED = "vitrin/App/FILE_UPLOADED";
export const REMOVE_FILE = "vitrin/App/REMOVE_FILE";
export const SET_SITE_DOMAIN = "vitrin/App/SET_SITE_DOMAIN";
export const MANY_ACTIONS = "vitrin/App/MANY_ACTIONS";
export const SEND_EMAIL = "vitrin/App/SEND_EMAIL";
export const UPLOAD_REQUEST = "vitrin/App/UPLOAD_REQUEST";
export const UPLOAD_REQUEST_FINISHED = "vitrin/App/UPLOAD_REQUEST_FINISHED";
export const UPLOAD_PROGRESS = "vitrin/App/UPLOAD_PROGRESS";
export const UPLOAD_SUCCESS = "vitrin/App/UPLOAD_SUCCESS";
export const UPLOAD_FAILURE = "vitrin/App/UPLOAD_FAILURE";
export const SET_PRINTER_OPTIONS = 'app/AdminPanelApp/SET_PRINTER_OPTIONS';
export const TOGGLE_HAMI_MODAL = 'app/AdminPanelApp/TOGGLE_HAMI_MODAL';
export const ACCEPT_ORDER = 'app/AdminPanelApp/ACCEPT_ORDER';
export const SET_FIREBASE_TOKEN = 'app/AdminPanelApp/SET_FIREBASE_TOKEN';

export const GLOBAL_LOADING_TYPE = "global";
