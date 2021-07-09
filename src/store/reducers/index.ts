import { combineReducers } from "redux";
import defaultState from "../state";
import { handleAction } from "redux-actions";
import * as actions from "../actions";

const defaultReducer = <T>(state: T, action: { payload: T }) => action.payload;

const i18n = handleAction(actions.setI18n, defaultReducer, defaultState.i18n);

export default combineReducers({ i18n });
