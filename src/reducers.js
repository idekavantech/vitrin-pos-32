/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from '../utils/history';
import globalReducer from './containers/App/reducer';
import businessReducer from '../stores/business/reducer';
import userReducer from '../stores/user/reducer';
import uiReducer from '../stores/ui/reducer';
import transactionReducer from '../stores/transaction/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    global: globalReducer,
    router: connectRouter(history),
    business: businessReducer,
    user: userReducer,
    ui: uiReducer,
    transaction: transactionReducer,
    ...injectedReducers
  });
}
