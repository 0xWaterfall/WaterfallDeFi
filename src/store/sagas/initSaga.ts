import { fork, put, select } from "redux-saga/effects";
import { getI18n } from "store/actions";
import { selectI18n } from "store/selectors";

export function* initSaga() {
  yield fork(initI18nSaga);
}

export function* initI18nSaga() {
  const i18n: II18n | null = yield select(selectI18n);
  if (i18n) {
    yield put(getI18n(i18n.locale));
  } else {
    yield put(getI18n("en"));
  }
}
