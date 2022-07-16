/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { call, put, takeLatest, select } from '@redux-saga/core/effects';
import request from '../../../utils/request';
import { GET_ANALYTICS_DATA } from './constants';
import { startLoading, stopLoading } from '../App/actions';
import { ORDER_ANALYTICS_DATA_API } from '../../../utils/api';
import { setAnalyticsData } from './actions';
export function* getShoppingAnalyticsData(action) {
  try {
    yield put(startLoading());
    const {
      response: { data },
      status
    } = yield call(
      request,
      ORDER_ANALYTICS_DATA_API('shopping'),
      { id: action.data },
      'PATCH',
    );
    console.log(data,status);
    if (data) yield put(setAnalyticsData(data));
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(stopLoading());
  }
}
export default function* adminPanelAppSaga() {
  yield takeLatest(GET_ANALYTICS_DATA, getShoppingAnalyticsData);
}
