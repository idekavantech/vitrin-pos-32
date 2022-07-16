/* eslint-disable prettier/prettier */
/**
 * The global state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectGlobal = (state) => state.global || initialState;

const selectRouter = (state) => state.router;

const makeSelectLoading = () =>
  createSelector(selectGlobal, (globalState) => globalState.loading);

const makeSelectProgressLoading = () =>
  createSelector(selectGlobal, (globalState) => globalState.progressLoading);

const makeSelectUploadProgress = () =>
  createSelector(selectGlobal, (globalState) => globalState.uploadProgress);

const makeSelectUploadStarted = () =>
  createSelector(selectGlobal, (globalState) => globalState.uploadStarted);

const makeSelectInitLoading = () =>
  createSelector(selectGlobal, (globalState) => globalState.initLoading);

const makeSelectUploadedFile = () =>
  createSelector(selectGlobal, (globalState) => globalState.uploadedFile);

const makeSelectUploadedFiles = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.multipleUploadedFiles
  );

const makeSelectError = () =>
  createSelector(selectGlobal, (globalState) => globalState.error);

const makeSelectSubDomain = () =>
  createSelector(selectGlobal, (globalState) => globalState.subdomain);

const makeSelectLocation = () =>
  createSelector(selectRouter, (routerState) => routerState.location);

const makeSelectHamiModal = () =>
  createSelector(selectGlobal, (globalState) => globalState.hamiModal);
const makeSelectFirebaseToken = () =>
  createSelector(selectGlobal, (globalState) => globalState.firebaseToken);

export {
  makeSelectInitLoading,
  makeSelectUploadedFiles,
  makeSelectSubDomain,
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
  makeSelectUploadedFile,
  makeSelectUploadProgress,
  makeSelectUploadStarted,
  makeSelectProgressLoading,
  makeSelectHamiModal,
  makeSelectFirebaseToken,
};
