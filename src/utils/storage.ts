export const sessionStorageFn = {
  set<T>(name: string, data: T) {
    window.sessionStorage.setItem(name, JSON.stringify(data));
  },
  get(name: string) {
    return JSON.parse(window.sessionStorage.getItem(name) as string);
  }
};

export const localStorageFn = {
  set<T>(name: string, data: T) {
    window.localStorage.setItem(name, JSON.stringify(data));
  },
  get(name: string) {
    return JSON.parse(window.localStorage.getItem(name) as string);
  }
};
