declare module "@loadable/component";

type IAction<T> = {
  type: string;
  payload: T;
};

type IState = {
  i18n: II18n | null;
};

interface II18n {
  locale: string;
  languages: string[];
  messages: { [key: string]: string };
}
