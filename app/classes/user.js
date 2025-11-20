export default class User {
    constructor(email, firstName, lastName, role = null, id = null, token = null)
    {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role
        this.token = token;
    }

    isValid() {
        return this.email !== null && this.firstName !== null && this.lastName !== null;
    }
}