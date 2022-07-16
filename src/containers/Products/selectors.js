import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectProductsDomain = (state) => state.products || initialState;
const makeSelectFilteredDeals = () =>
  createSelector(selectProductsDomain, (state) => state.filteredDeals);
const makeSelectFilteredDealsPagination = () =>
  createSelector(
    selectProductsDomain,
    (state) => state.filteredDealsPagination
  );
const makeSelectUnavailableDeals = () =>
  createSelector(selectProductsDomain, (state) => state.unavailableDeals);
const makeSelectUnavailableDealsPagination = () =>
  createSelector(
    selectProductsDomain,
    (state) => state.unavailableDealsPagination
  );
export {
  selectProductsDomain,
  makeSelectFilteredDeals,
  makeSelectFilteredDealsPagination,
  makeSelectUnavailableDeals,
  makeSelectUnavailableDealsPagination,
};
