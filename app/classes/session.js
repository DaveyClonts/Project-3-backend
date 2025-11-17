export default class Session {
    constructor(userID, email, token, expirationDate, id = null) {
        this.id = id;
        this.userID = userID;
        this.email = email;
        this.token = token;
        this.expirationDate = expirationDate;
    }
}