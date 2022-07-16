/* eslint-disable no-console */
import { call, put, takeLatest, select } from "@redux-saga/core/effects";

import request from "../../../utils/request";
import {
  BUSINESS_ORDERS_SORTED_BY_DELIVERER_API,
  ORDERS_LIST_DELIVERER_API,
} from "../../../utils/api";
import { getAdminOrders, setAdminOrders } from "./actions";
import {
  GET_ADMIN_ORDERS,
  ORDERS_PAGE_SIZE,
  SET_DELIVERERS,
} from "./constants";
import { makeSelectSubDomain } from "../App/selectors";
import {
  startLoading,
  startProgressLoading,
  stopLoading,
  stopProgressLoading,
} from "../App/actions";
import { setSnackBarMessage } from "../../../stores/ui/actions";

export function* getOrdersFunc(action) {
  try {
    yield put(startProgressLoading());
    const domain = yield select(makeSelectSubDomain());
    const page = action.data.page || 1;
    const body = { domain };
    body.delivery_company = action.data.hasDeliverer;
    const {
      response: { data, pagination },
    } = yield call(
      request,
      BUSINESS_ORDERS_SORTED_BY_DELIVERER_API(
        "shopping",
        page,
        ORDERS_PAGE_SIZE
      ),
      { ...body },
      "GET"
    );
    const pagesCount = Math.ceil(pagination.count / ORDERS_PAGE_SIZE);

    if (data) {
      yield put(setAdminOrders(data, { ...pagination, pagesCount }));
    }
    yield put(stopProgressLoading());
  } catch (err) {
    console.log(err);
    yield put(stopProgressLoading());
  }
}
export function* setDeliverers(action) {
  try {
    yield put(startLoading());
    if (action.data.deliverer || action.data.deliverer === null) {
      const {
        response: { data },
      } = yield call(
        request,
        ORDERS_LIST_DELIVERER_API(action.data.id, "shopping"),
        {
          courier_id: action.data.deliverer,
          send_sms: action.data.sendSms,
          orders: action.data.orders,
        },
        "PATCH"
      );
      if (data) {
        yield put(getAdminOrders(action.data.page, action.data.hasDeliverer));
        yield put(
          setSnackBarMessage("تخصیص پیک با موفقیت انجام شد.", "success")
        );
      } else
        yield put(
          setSnackBarMessage("در تخصیص پیک خطایی رخ داده است!", "fail")
        );
    }
    yield put(stopLoading());
  } catch (err) {
    yield put(setSnackBarMessage("در تایید سفارش خطایی رخ داده است!", "fail"));
    yield put(stopLoading());
  }
}
export default function* adminPanelAppSaga() {
  yield takeLatest(GET_ADMIN_ORDERS, getOrdersFunc);
  yield takeLatest(SET_DELIVERERS, setDeliverers);
}
