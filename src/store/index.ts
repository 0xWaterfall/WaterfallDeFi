import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import i18n from "./i18n";
import markets from "./markets";
import { load, save } from "redux-localstorage-simple";
import selectedKeys from "./selectedKeys";
import position from "./position";
import showStatus from "./showStatus";
import WTFInfo from "./WTFInfo";

const PERSISTED_KEYS: string[] = ["i18n.locale", "selectedKeys", "showStatus.cookieModal"];

const PERSISTED = { states: PERSISTED_KEYS, namespace: "waterfall", namespaceSeparator: "." };

export const store = configureStore({
  devTools: true,
  reducer: {
    i18n,
    markets,
    selectedKeys,
    position,
    showStatus,
    WTFInfo
  },
  preloadedState: load(PERSISTED),
  middleware: [...getDefaultMiddleware({ thunk: true }), save(PERSISTED)]
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
