export default class Session {
    constructor(userID, token, expirationDate, id = null) {
        this.id = id;
        this.userID = userID;
        this.token = token;
        this.expirationDate = expirationDate;
    }
}