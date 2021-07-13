type Overwrite<T, U> = Rewrite<T, U> & U;

type IAction<T> = {
  type: string;
  payload: T;
};

interface II18n {
  locale: string;
  languages: string[];
  messages: { [key: string]: string };
}
