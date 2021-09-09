import { notification } from "antd";

export const successNotification = (title: string, desc: string) => {
  notification["success"]({
    message: title,
    description: desc
  });
};
