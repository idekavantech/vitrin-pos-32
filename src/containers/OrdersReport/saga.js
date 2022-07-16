/* eslint-disable no-console */
import { call, put, takeLatest, select } from '@redux-saga/core/effects';

import request from '../../../utils/request';
import { BUSINESS_ORDERS_API, REPORTS_API } from '../../../utils/api';
import { setAdminOrders, setOrdersReport } from "./actions";
import {
  GET_ADMIN_ORDERS,
  ADMIN_ORDERS_PAGE_SIZE,
  GET_ORDERS_REPORT,
} from './constants';
import { makeSelectSubDomain } from '../App/selectors';
import { startProgressLoading, stopProgressLoading } from '../App/actions';

export function* getAdminOrdersFunc(action) {
  try {
    yield put(startProgressLoading());
    const domain = yield select(makeSelectSubDomain());
    const {
      response: { data, pagination },
    } = yield call(
      request,
      BUSINESS_ORDERS_API('shopping'),
      { ...action.data, page_size: ADMIN_ORDERS_PAGE_SIZE, domain },
      'GET',
    );
    const pagesCount = Math.ceil(pagination.count / ADMIN_ORDERS_PAGE_SIZE);

    if (data) {
      yield put(setAdminOrders(data, { ...pagination, pagesCount }));
    }
    yield put(stopProgressLoading());
  } catch (err) {
    yield put(stopProgressLoading());
    console.log(err);
  }
}

export function* getOrdersReportFunc(action) {
  try {
    yield put(startProgressLoading());
    const domain = yield select(makeSelectSubDomain());
    const {
      response: { data },
    } = yield call(request, REPORTS_API, { ...action.data, domain }, 'GET');
    console.log(data);
    yield put(setOrdersReport(data));
    yield put(stopProgressLoading());
  } catch (err) {
    yield put(stopProgressLoading());
    console.log(err);
  }
}
export default function* adminPanelAppSaga() {
  yield takeLatest(GET_ADMIN_ORDERS, getAdminOrdersFunc);
  yield takeLatest(GET_ORDERS_REPORT, getOrdersReportFunc);
}
