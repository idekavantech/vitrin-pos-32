/**
 * Gets the repositories of the user from Github
 */
import Axios from "axios";
import { call, put, takeLatest, select, take, all } from "redux-saga/effects";
import {
  setSiteDomain,
  startLoading,
  stopLoading,
} from "../../src/containers/App/actions";
import request from "../../utils/request";
import {
  BUSINESS_LIGHT_BY_SITE_DOMAIN_API,
  BUSINESSES_BY_OWNER_API,
  GET_BUSINESS_DEVICES_API,
  LOGIN_API,
  USER_INFO_API,
  VERIFY_API,
} from "../../utils/api";
import {
  GET_BUSINESSES,
  LOGIN,
  UPDATE_DEVICE_BY_ID,
  UPDATE_PROFILE,
  VERIFICATION,
} from "./constants";
import { setSnackBarMessage } from "../ui/actions";
import { setLoginCallBack, setToken, setUser, setBusinesses } from "./actions";
import { makeSelectBusinesses, makeSelectLoginCallBack } from "./selector";
import { getBusinessData } from "../business/saga";

export function* login(payload) {
  try {
    yield put(startLoading());
    const { data } = payload;
    const dto = {
      phone: data,
    };
    yield call(request, LOGIN_API, dto, "POST");
    yield put(
      setSnackBarMessage("کد تایید به موبایل شما پیامک شد.", "default")
    );
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}

export function* verify(action) {
  try {
    yield put(startLoading());
    const {
      data: { username, password },
    } = action;
    const dto = {
      username,
      password,
    };
    const {
      response: { meta, data: userToken },
    } = yield call(request, VERIFY_API, dto, "POST");
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      const { token, user } = userToken;
      yield put(setToken(token));
      yield put(setUser(user));
      localStorage.setItem("token", token);
      Axios.defaults.headers.common.Authorization = `Token ${token}`;
      yield call(getBusinesses);
      action.history.push("/orders");
      yield put(stopLoading());
      const callBack = yield select(makeSelectLoginCallBack());
      yield call(callBack);
      yield put(setLoginCallBack(() => {}));
    } else yield put(setSnackBarMessage("کد تایید نادرست است", "fail"));
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(stopLoading());
  }
}

export function* getBusinesses() {
  try {
    yield put(startLoading());

    const {
      response: { meta, data },
    } = yield call(request, BUSINESSES_BY_OWNER_API);
    console.log(data);
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      const businessesWithVitrin = data.filter(
        (b) => b.get_vitrin_absolute_url
      );
      if (businessesWithVitrin.length !== 0) {
        const fullBusinessData = [];
        yield all(
          businessesWithVitrin.map(async (business) => {
            const {
              response: { data: businessesData },
            } = await request(
              BUSINESS_LIGHT_BY_SITE_DOMAIN_API(business.site_domain),
              {},
              "GET"
            );
            const {
              response: { meta, data: devicesData },
            } = await request(GET_BUSINESS_DEVICES_API, {
              business_slug: business.slug,
            });

            fullBusinessData.push({
              ...businessesData,
              devices: devicesData,
            });
          })
        );
        fullBusinessData.sort((b1, b2) => {
          const businessIndex1 = businessesWithVitrin.findIndex(
            (bus) => bus.slug === b1.slug
          );
          const businessIndex2 = businessesWithVitrin.findIndex(
            (bus) => bus.slug === b2.slug
          );
          if (businessIndex1 > businessIndex2) return 1;
          else if (businessIndex1 < businessIndex2) return -1;
          return 0 < businessesWithVitrin.findIndex((bus) => bus.slug === b2)
            ? 1
            : -1;
        });
        yield put(setBusinesses(fullBusinessData));
        yield put(setSiteDomain(businessesWithVitrin[0].site_domain));
        yield call(getBusinessData);
      }
    }
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(stopLoading());
  }
}

export function* updateProfile(action) {
  try {
    yield put(startLoading());
    const {
      response: { data, meta },
    } = yield call(request, USER_INFO_API, action.data, "PATCH");
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      yield put(
        setSnackBarMessage("ویرایش اطلاعات با موفقیت انجام شد", "success")
      );
      yield put(setUser(data));
    } else yield put(setSnackBarMessage("ویرایش اطلاعات ناموفق بود", "fail"));
    yield put(stopLoading());
  } catch (err) {
    yield put(setSnackBarMessage("ویرایش اطلاعات ناموفق بود", "fail"));
    yield put(stopLoading());
  }
}

export function* updateDeviceByIdSaga(action) {
  try {
    const businesses = yield select(makeSelectBusinesses());
    const {
      response: { meta, data: devicesData },
    } = yield call(request, GET_BUSINESS_DEVICES_API, {
      business_slug: action.data,
    });
    console.log(businesses);
    yield put(
      setBusinesses(
        businesses.map((business) => {
          if (business.slug !== action.data) return business;
          else return { ...business, devices: devicesData };
        })
      )
    );
  } catch (err) {
    console.log(err);
    yield put(stopLoading());
  }
}
export default [
  takeLatest(LOGIN, login),
  takeLatest(VERIFICATION, verify),
  takeLatest(UPDATE_PROFILE, updateProfile),
  takeLatest(GET_BUSINESSES, getBusinesses),
  takeLatest(UPDATE_DEVICE_BY_ID, updateDeviceByIdSaga),
];
