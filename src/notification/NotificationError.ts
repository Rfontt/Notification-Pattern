import { NotificationErrorProps } from "../interfaces/notification.interface";

export default class NotificationError extends Error {
    constructor(public errors: NotificationErrorProps[]) {
        let message: string;

        errors.map((error) => {
            message += `${error.context}: ${error.message},`
        });

        super(message);
    }
}