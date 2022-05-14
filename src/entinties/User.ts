export default class User {
    private id: number;
    private name: string;
    private email: string;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;

        this.validate();
    }

    validate(): void {
        if (this.id === undefined || null) {
            throw new Error('ID is required');
        }

        if (!this.name) {
            throw new Error('Name is required');
        }

        if (!this.email) {
            throw new Error('Email is required');
        }
    }
}