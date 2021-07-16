import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getI18nLanguages, getI18nMessages } from "services/http";

const initialState: II18n = { locale: "en", languages: [], messages: {} };

export const fetchI18nMiddleware = createAsyncThunk<II18n | undefined, string>("i18n/fetchI18n", async (payload) => {
  try {
    if (!payload) return;
    const languages: string[] = await getI18nLanguages();
    const locale = languages.find((p) => p.includes(payload));
    if (locale) {
      const messages: { [key: string]: string } = await getI18nMessages(locale);
      document.documentElement.lang = locale;
      return { locale, languages, messages };
    }
  } catch (e) {
    console.error(new Error(e));
  }
});

export const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    setI18n: (state, action: PayloadAction<II18n>) => action.payload
  },
  extraReducers: (builder) => {
    builder.addCase(fetchI18nMiddleware.fulfilled, (state, { payload }) => payload && payload);
  }
});

// Actions
export const { setI18n } = i18nSlice.actions;

export default i18nSlice.reducer;
