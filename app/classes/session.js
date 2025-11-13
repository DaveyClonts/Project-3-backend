export default class Session {
    constructor(userID, email, token, expirationDate) {
        this.userID = userID;
        this.email = email;
        this.token = token;
        this.expirationDate = expirationDate;
    }
}