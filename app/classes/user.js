export default class User {
    constructor(email, firstName, lastName, role, id = undefined, token = undefined)
    {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role
        this.sessionToken = token;
        this.role = role;
    }

    isValid() {
        return this.email !== undefined && this.firstName !== undefined && this.lastName !== undefined && this.role !== undefined;
    }
}