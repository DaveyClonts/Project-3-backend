export default class User {
    constructor(email, firstName, lastName, role, id = undefined, token = undefined)
    {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role
        this.sessionToken = token;
    }

    isValid() {
        return this.email !== undefined && this.firstName !== undefined && this.lastName !== undefined;
    }
}