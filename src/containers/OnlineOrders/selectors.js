import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the admin state domain
 */

const selectAdminDomain = (state) => state.adminOrders || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Admin
 */

const makeSelectAdmin = () => createSelector(selectAdminDomain, (substate) => substate);
const makeSelectAdminOrders = () =>
  createSelector(selectAdminDomain, (state) => state.adminOrders);
const makeSelectAdminOrdersPagination = () =>
  createSelector(selectAdminDomain, (state) => state.adminOrdersPagination);

export default makeSelectAdmin;
export { selectAdminDomain, makeSelectAdminOrders, makeSelectAdminOrdersPagination };
