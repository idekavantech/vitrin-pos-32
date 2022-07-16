import {
  SET_USER,
  SET_ADMIN,
  LOGIN,
  VERIFICATION,
  SET_TOKEN,
  UPDATE_PROFILE,
  SET_LOGIN_CALLBACK,
  GET_BUSINESSES,
  SET_BUSINESSES,
  UPDATE_DEVICE_BY_ID,
} from "./constants";

export function setUser(user) {
  return {
    type: SET_USER,
    data: user,
  };
}

export function setAdmin(data) {
  return {
    type: SET_ADMIN,
    data,
  };
}

export function setToken(data) {
  return {
    type: SET_TOKEN,
    data,
  };
}

export function login(phone) {
  return {
    type: LOGIN,
    data: phone,
  };
}

export function verify(phone, code, history) {
  return {
    type: VERIFICATION,
    data: { username: phone, password: code },
    history,
  };
}

export function getBusinesses() {
  return {
    type: GET_BUSINESSES,
  };
}

export function setBusinesses(businesses) {
  return {
    type: SET_BUSINESSES,
    data: businesses,
  };
}

export function updateProfile(data) {
  return {
    type: UPDATE_PROFILE,
    data,
  };
}

export function setLoginCallBack(data) {
  return {
    type: SET_LOGIN_CALLBACK,
    data,
  };
}
export function updateDeviceById(data) {
  return {
    type: UPDATE_DEVICE_BY_ID,
    data,
  };
}
