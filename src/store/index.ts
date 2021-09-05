import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import i18n, { fetchI18nMiddleware } from "./i18n";
import markets from "./markets";
import { load, save } from "redux-localstorage-simple";

const PERSISTED_KEYS: string[] = ["i18n.locale"];

export const store = configureStore({
  devTools: true,
  preloadedState: load({ states: PERSISTED_KEYS, namespace: "waterfall", namespaceSeparator: "." }),
  reducer: {
    i18n,
    markets
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(
      save({ states: PERSISTED_KEYS, debounce: 1000, namespace: "waterfall", namespaceSeparator: "." })
    )
});
store.dispatch(fetchI18nMiddleware(store.getState().i18n.locale));

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
