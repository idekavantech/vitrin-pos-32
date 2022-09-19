/* eslint-disable no-console */
import { call, put, takeLatest, select } from "@redux-saga/core/effects";

import request from "../../../utils/request";
import {
  CHANGE_CATEGORY_ORDER,
  GET_DEALS,
  GET_UNAVAILABLE_DEALS,
} from "./constants";
import {
  ALL_DEALS_API,
  CATEGORIES_ITEMS_CHANGE_ORDER_API,
  DEALS_ITEMS_API,
} from "../../../utils/api";
import { startLoading, stopLoading } from "../App/actions";
import { makeSelectBusinessSlug } from "../../../stores/business/selector";
import { setDeals, setUnavailableDeals } from "./actions";

export function* changeCategoryOrderFunc({ data: { id, newIndex } }) {
  try {
    yield put(startLoading());
    yield call(
      request,
      CATEGORIES_ITEMS_CHANGE_ORDER_API(id),
      {
        order: newIndex,
      },
      "PATCH"
    );
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}
export function* getFilteredDeals(action) {
  yield put(setDeals(null, {}));

  const categories = action.data.categories.reduce(
    (str, category) => `${str}&label_id=${category}`,
    ""
  );
  const slug = yield select(makeSelectBusinessSlug());
  try {
    yield put(startLoading());
    const {
      response: { meta, data, pagination },
    } = yield call(request, `${ALL_DEALS_API(slug)}${categories}`, {
      ...action.data.filters,
    });
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      const pagesCount = Math.ceil(pagination.count / 24);

      yield put(setDeals(data, { ...pagination, pagesCount }));
    }
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(stopLoading());
  }
}
export function* getUnavailableDeals(action) {
  yield put(setUnavailableDeals(null, {}));

  const categories = action.data.categories.reduce(
    (str, category) => `${str}&label_id=${category}`,
    ""
  );
  const slug = yield select(makeSelectBusinessSlug());
  try {
    yield put(startLoading());
    const {
      response: { meta, data, pagination },
    } = yield call(request, `${ALL_DEALS_API(slug)}${categories}`, {
      available: false,
      ...action.data.filters,
    });

    if (meta.status_code >= 200 && meta.status_code <= 300) {
      const pagesCount = Math.ceil(pagination.count / 10);

      yield put(setUnavailableDeals(data, { ...pagination, pagesCount }));
    }
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(stopLoading());
  }
}
export default function* adminPanelAppSaga() {
  yield takeLatest(CHANGE_CATEGORY_ORDER, changeCategoryOrderFunc);
  yield takeLatest(GET_DEALS, getFilteredDeals);
  yield takeLatest(GET_UNAVAILABLE_DEALS, getUnavailableDeals);
}
