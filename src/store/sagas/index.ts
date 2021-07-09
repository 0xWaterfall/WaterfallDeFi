import { all, fork } from "redux-saga/effects";
import { i18nSaga } from "./i18nSaga";
import { initSaga } from "./initSaga";

export default function* rootSaga() {
  yield all([fork(initSaga), fork(i18nSaga)]);
}
