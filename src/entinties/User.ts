import NotificationInterface from "../interfaces/notification.interface";
import Notification from "../notification/Notification";
import NotificationError from "../notification/NotificationError";

export default class User {
    private id: number;
    private name: string;
    private email: string;
    private notification: NotificationInterface;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.notification = new Notification();
        this.validate();
        
        if(this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    validate(): void {
        if (this.id === undefined || null) {
            this.notification.addError({
                context: "User",
                message: "ID is required"
            });
        }

        if (!this.name) {
            this.notification.addError({
                context: "User",
                message: "Name is required"
            });
        }

        if (!this.email) {
            this.notification.addError({
                context: "User",
                message: "Email is required"
            });
        }
    }
}