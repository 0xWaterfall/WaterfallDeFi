import { createActions } from "redux-actions";

// 生成action结构
export const { setI18n, getI18n } = createActions("SET_I18N", "GET_I18N");
