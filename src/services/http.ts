import { I18N } from "config";

export const getI18nLanguages = async () => {
  const response = await fetch(`${I18N}languages.json`);
  const data = await response.json();
  return data;
};

export const getI18nMessages = async (locale: string) => {
  const response = await fetch(`${I18N}${locale}.json`);
  const data = await response.json();
  return data;
};
