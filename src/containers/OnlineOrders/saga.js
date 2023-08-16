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
import {makeSelectBusinessId, makeSelectBusinessSiteDomain} from "../../../stores/business/selector";
import { SHOPPING_PLUGIN } from "../../../utils/constants";

export function* getAdminOrdersFunc(action) {
  try {
    yield put(startProgressLoading());
    yield put(setAdminOrders(null));
    const businessId = yield select(makeSelectBusinessId());
    const domain = yield select(makeSelectSubDomain());

    const {
      response: { data, pagination },
    } = yield call(
      request,
      BUSINESS_ORDERS_API(SHOPPING_PLUGIN,action?.data?.page || 1,
        action?.data?.page_size || 20, true),
      {  business_id: action.businessId || businessId, sales_channel: null,
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
            .filter((order) => order.order_status === 40)
            .map((order) =>
              put(
                acceptOrder({
                  order,
                  plugin: SHOPPING_PLUGIN,
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
