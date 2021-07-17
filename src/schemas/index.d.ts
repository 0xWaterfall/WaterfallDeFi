type Rewrite<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

type Overwrite<T, U> = Rewrite<T, U> & U;

interface II18n {
  locale: string;
  languages: string[];
  messages: { [key: string]: string };
}
