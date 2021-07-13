import { createDraftSafeSelector, createSelector } from "@reduxjs/toolkit";

export const selectState = (state: IState) => state.i18n;
export const useSelectI18n = createSelector<IState, II18n | null, II18n | null>(
  selectState,
  (i18n: II18n | null) => i18n
);
