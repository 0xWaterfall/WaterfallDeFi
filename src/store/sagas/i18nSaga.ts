import { call, fork, put, select, takeLatest } from "redux-saga/effects";
import { fetchI18nLanguages, fetchI18nMessages } from "services/http";
import { getI18n, setI18n } from "store/actions";
import { selectI18n } from "store/selectors";

export function* initI18nSaga() {
  const i18n: II18n | null = yield select(selectI18n);
  if (i18n) {
    yield put(getI18n(i18n.locale));
  } else {
    yield put(getI18n("en"));
  }
}
export function* getI18nSaga({ payload }: IAction<string | null | undefined>) {
  yield fork(function* () {
    try {
      if (!payload) return;
      const languages: string[] = yield call(fetchI18nLanguages);
      const locale = languages.find((p) => p.includes(payload));
      if (locale) {
        const messages: { [key: string]: string } = yield call(fetchI18nMessages, locale);
        yield put(
          setI18n({
            locale,
            languages,
            messages
          })
        );
      }
    } catch (e) {
      console.error(new Error(e));
    }
  });
}
export function* i18nSaga() {
  yield takeLatest(getI18n, getI18nSaga);
}
