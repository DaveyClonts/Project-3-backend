export default class Exercise {
    constructor(name, type, description, userID) {
        this.name = name;
        this.type = type;
        this.description = (description != undefined) ? description : "";
        this.userID = userID;
    }
}