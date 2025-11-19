export default class User {
    constructor(email, firstName, lastName, id = undefined, token = undefined, role)
    {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sessionToken = token;
        this.role = role;
    }

    isValid() {
        return this.email !== undefined && this.firstName !== undefined && this.lastName !== undefined && this.role !== undefined;
    }
}