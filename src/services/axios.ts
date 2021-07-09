import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// interceptor response
axios.interceptors.response.use(
  (response) => {
    const result = response.data;
    return result;
  },
  (err) => {
    if (err.response) {
      return Promise.resolve(err.response?.data?.code ? err.response : null);
    } else {
      // message.error(error("Disconnect"));
    }
  }
);

export const get = (url: string, params = {}, config = {}) =>
  axios.get(url, {
    params,
    ...config
  });

export const post = (url: string, data = {}, config = {}) => axios.post(url, data, config);
