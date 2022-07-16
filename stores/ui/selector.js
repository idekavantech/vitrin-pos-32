/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { makeUiQueryObject } from './selectorHelper';

const selectUi = state => state.ui || initialState;

const makeSelectModals = () =>
  createSelector(
    selectUi,
    state => state.modals,
  );

const makeSelectDrawers = () =>
  createSelector(
    selectUi,
    state => state.drawers,
  );

const makeSelectModal = modalName =>
  createSelector(
    selectUi,
    state => state.modals[modalName],
  );

const makeSelectUiObject = () =>
  createSelector(
    selectUi,
    state => makeUiQueryObject(state),
  );
const makeSelectSnackBarMessage = () =>
  createSelector(
    selectUi,
    state => state.snackBarMessage,
  );

export {
  makeSelectDrawers,
  makeSelectModals,
  makeSelectModal,
  makeSelectUiObject,
  makeSelectSnackBarMessage,
};
