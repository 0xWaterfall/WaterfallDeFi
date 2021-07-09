import { createSelector } from "reselect";

export const selectI18n = createSelector<IState, II18n | null, II18n | null>(
  (state) => state.i18n,
  (i18n: II18n | null) => i18n
);
