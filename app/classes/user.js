export default class User {
    constructor(email, firstName, lastName, id = undefined, token = undefined)
    {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sessionToken = token;
    }

    isValid() {
        return this.email !== undefined && this.firstName !== undefined && this.lastName !== undefined;
    }
}