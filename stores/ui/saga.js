import history from "../../utils/history";
import { takeLatest } from "@redux-saga/core/effects";

import { RELOAD_PAGE } from "./constants";

export function* getBusinessData() {
  try {
    const pathname = history.location.pathname;
    history.push({ pathname: "/empty" });
    setTimeout(() => {
      history.replace({ pathname });
    }, 0);
  } catch (err) {
    console.log(err);
  }
}
export default [takeLatest(RELOAD_PAGE, getBusinessData)];
