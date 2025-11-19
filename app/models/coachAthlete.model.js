import { DataTypes } from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLCoachAthlete = SequelizeInstance.define("coachAthlete", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    athleteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    coachID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default SQLCoachAthlete;