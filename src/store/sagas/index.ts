import { all, fork } from "redux-saga/effects";
import { initSaga } from "./initSaga";

export default function* rootSaga() {
  yield all([fork(initSaga)]);
}
