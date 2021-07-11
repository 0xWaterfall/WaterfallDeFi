import { fork, put, select } from "redux-saga/effects";
import { initI18nSaga } from "./i18nSaga";

export function* initSaga() {
  yield fork(initI18nSaga);
}
