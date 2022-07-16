import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the admin state domain
 */

const selectAdminDomain = (state) => state.adminOrder || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Admin
 */

const makeSelectAdmin = () =>
  createSelector(selectAdminDomain, (substate) => substate);
const makeSelectAdminOrder = () =>
  createSelector(selectAdminDomain, (state) => state.adminOrder);
const makeSelectCustomerOrders = () =>
  createSelector(selectAdminDomain, (state) => state.customerOrders);
export default makeSelectAdmin;

export { selectAdminDomain, makeSelectAdminOrder, makeSelectCustomerOrders };
