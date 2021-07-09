type IAction<T> = {
  type: string;
  payload: T;
};

type IState = {
  marketsComponentShow: boolean;
  i18n: II18n | null;
  user: IUser | null;
};

interface II18n {
  locale: string;
  languages: string[];
  messages: { [key: string]: string };
}

interface IUser {
  accountName: string;
}
