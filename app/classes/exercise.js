export default class Exercise {
    constructor(name, type, description, coachID) {
        this.name = name;
        this.type = type;
        this.description = (description != undefined) ? description : "";
        this.coachID = coachID;
    }
}