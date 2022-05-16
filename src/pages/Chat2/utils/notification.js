import { notification } from "antd";

export const openNotification = (placement, message, description) => {
    notification.error({
        message,
        description,
        placement,
    });
};
