import { notification } from "antd";
import { ReactNode } from "react";
import Button from "./../components/Button/Button";

export const successNotification = (title: string, desc: string) => {
  notification["success"]({
    message: title,
    description: desc
  });
};
