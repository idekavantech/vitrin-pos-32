import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { startLoading, stopLoading } from '../../src/containers/App/actions';
import request from '../../utils/request';
import {
  BUSINESS_BUY_VISIT_CARD_SMS_API,
  GET_ORDER_TRANSACTION_API,
  GET_TRANSACTION_API,
  ORDER_ONLINE_PAYMENT_API,
  TRANSACTION_API,
  TRANSACTION_ZIBAL_API,
} from '../../utils/api';
import {
  BUY_VISIT_CARD_SMS,
  GET_ORDER_TRANSACTION,
  GET_TRANSACTION,
  ORDER_ONLINE_PAYMENT,
} from './constants';
import { setTransaction } from './actions';
import { closeModals } from '../ui/actions';
import { makeSelectBusinessSlug } from '../business/selector';

export function* getTransactionData(action) {
  try {
    yield put(startLoading());
    const {
      response: { data: transaction },
    } = yield call(request, GET_TRANSACTION_API(action.id), {}, 'GET');
    yield put(closeModals());
    yield put(setTransaction(transaction));
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}
export function* getOrderTransactionData(action) {
  try {
    yield put(startLoading());
    const {
      response: { data: transaction },
    } = yield call(request, GET_ORDER_TRANSACTION_API(action.id), {}, 'GET');
    yield put(closeModals());
    yield put(setTransaction(transaction));
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}
export function* orderPayment(action) {
  try {
    yield put(startLoading());
    const {
      response: { data },
    } = yield call(
      request,
      ORDER_ONLINE_PAYMENT_API(action.id, action.data.plugin),
      action.data,
      'PATCH',
    );
    if (data) {
      const { transaction_id: transactionID } = data;
      const {
        response: { data: paymentData },
      } = yield call(request, TRANSACTION_ZIBAL_API(transactionID), {}, 'GET');
      if (paymentData) {
        const { url } = paymentData;
        window.location.href = url;
      }
    }
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}

export function* buyVisitCardSMS(action) {
  try {
    yield put(startLoading());
    const slug = yield select(makeSelectBusinessSlug());
    const {
      response: { data },
    } = yield call(
      request,
      BUSINESS_BUY_VISIT_CARD_SMS_API(slug),
      action.data,
      'PATCH',
    );
    if (data) {
      const { transaction_id: transactionID } = data;
      const {
        response: { data: paymentData },
      } = yield call(
        request,
        TRANSACTION_API(transactionID, action.gateway),
        {},
        'GET',
      );
      if (paymentData) {
        const { url } = paymentData;
        window.location.href = url;
      }
    }
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}

export default [
  takeLatest(GET_TRANSACTION, getTransactionData),
  takeLatest(GET_ORDER_TRANSACTION, getOrderTransactionData),
  takeLatest(ORDER_ONLINE_PAYMENT, orderPayment),
  takeLatest(BUY_VISIT_CARD_SMS, buyVisitCardSMS),
];
