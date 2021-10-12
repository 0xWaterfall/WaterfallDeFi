import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import i18n from "./i18n";
import markets from "./markets";
import selectedKeys from "./selectedKeys";
import position from "./position";
import showStatus from "./showStatus";
import WTFInfo from "./WTFInfo";

const persistConfig = {
  key: "waterfall",
  version: 1.0,
  storage,
  whitelist: ["i18n", "selectedKeys"]
};

const reducers = {
  i18n,
  markets,
  selectedKeys,
  position,
  showStatus,
  WTFInfo
};

const combinedReducer = combineReducers<typeof reducers>(reducers);

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  ]
});

export const persistor = persistStore(store);

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
