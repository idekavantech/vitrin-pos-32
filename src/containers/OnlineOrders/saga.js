/* eslint-disable no-console */
import { call, put, takeLatest, select, all } from "@redux-saga/core/effects";
import request from "../../../utils/request";
import { BUSINESS_ORDERS_API } from "../../../utils/api";
import { setAdminOrders } from "./actions";
import { GET_ADMIN_ORDERS, ADMIN_ORDERS_PAGE_SIZE } from "./constants";
import { makeSelectSubDomain } from "../App/selectors";
import {
  acceptOrder,
  startProgressLoading,
  stopProgressLoading,
} from "../App/actions";

export function* getAdminOrdersFunc(action) {
  try {
    yield put(startProgressLoading());
    const domain = yield select(makeSelectSubDomain());
    const {
      response: { data, pagination },
    } = yield call(
      request,
      BUSINESS_ORDERS_API("shopping"),
      {
        page_size: ADMIN_ORDERS_PAGE_SIZE,
        domain,
        sales_channel: "vitrin",
        ...action.data,
      },
      "GET"
    );
    const pagesCount = Math.ceil(pagination.count / ADMIN_ORDERS_PAGE_SIZE);

    if (data) {
      yield put(setAdminOrders(data, { ...pagination, pagesCount }));
      if (
        localStorage.getItem("integrated") === "hami" &&
        (
          JSON.parse(localStorage.getItem("hamiIntegratedBusinesses")) || []
        ).includes(domain) &&
        !localStorage.getItem("hamiPreventSendOrders")
      )
        yield all(
          data
            .filter((order) => order.order_status === 0)
            .map((order) =>
              put(
                acceptOrder({
                  order,
                  plugin: "shopping",
                  preventSms: true,
                })
              )
            )
        );
    }
    yield put(stopProgressLoading());
  } catch (err) {
    yield put(stopProgressLoading());
    console.log(err);
  }
}

export default function* adminPanelAppSaga() {
  yield takeLatest(GET_ADMIN_ORDERS, getAdminOrdersFunc);
}
