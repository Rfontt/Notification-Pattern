import NotificationInterface, { NotificationErrorProps } from "../interfaces/notification.interface";

export default class Notification implements NotificationInterface {
    private errors: NotificationErrorProps[] = [];

    addError(error: NotificationErrorProps): void {
        this.errors.push(error);
    }
    hasErrors(): boolean {
        return this.errors.length > 0;
    }
    getErrors(): NotificationErrorProps[] {
        return this.errors;
    }
    messages(context?: string): string {
        let message = '';

        this.errors.map((error) => {
            if (context === undefined || error.context === context) {
                message += `${error.context}: ${error.message},`;
            }
        });

        return message;
    }    
}