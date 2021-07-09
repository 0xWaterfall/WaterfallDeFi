import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import _throttle from "lodash/throttle";
import _pick from "lodash/pick";
import reducers from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const middlewares = compose(
  applyMiddleware(sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f: Function) => f
);
const loadState = () => {
  const stateFromLocalStorage: string | null = localStorage.getItem("waterfall");
  return stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : undefined;
};

const saveStateToLocalStorage = <T>(state: T) => {
  return localStorage.setItem("waterfall", JSON.stringify(state));
};

export const initStore = (initialState: IState) => createStore(reducers, initialState, middlewares);

const store = initStore(loadState());

store.subscribe(
  _throttle(() => {
    const stateToSaveToLocalStorage = _pick(store.getState(), [
      // TODO: Fields that need to be cached
      "i18n"
    ]);
    saveStateToLocalStorage(stateToSaveToLocalStorage);
  }, 1000)
);

sagaMiddleware.run(rootSaga);

export default store;
