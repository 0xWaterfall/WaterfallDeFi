import axios from "axios";
import { I18N } from "config";
import { get, post } from "./axios";

export const getI18nLanguages = async () => {
  const productionUrl = `${I18N}languages.json`;
  const result = await axios.get(productionUrl);
  return result.data;
};

export const getI18nMessages = async (locale: string) => {
  const productionUrl = `${I18N}${locale}.json`;
  const result = await axios.get(productionUrl);
  return result.data;
};
