/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTransaction = state => state.transaction || initialState;

const makeSelectTransaction = () =>
  createSelector(
    selectTransaction,
    state => state.transaction,
  );

export { makeSelectTransaction };
