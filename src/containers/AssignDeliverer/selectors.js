import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the admin state domain
 */

const selectAdminDomain = (state) => state.assignDeliverer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Admin
 */

const makeSelectAdmin = () => createSelector(selectAdminDomain, (substate) => substate);
const makeSelectOrders = () => createSelector(selectAdminDomain, (state) => state.orders);
const makeSelectOrdersPagination = () =>
  createSelector(selectAdminDomain, (state) => state.ordersPagination);

export default makeSelectAdmin;
export { selectAdminDomain, makeSelectOrdersPagination, makeSelectOrders };
