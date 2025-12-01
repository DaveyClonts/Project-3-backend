import { DataTypes } from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLCoachAthlete = SequelizeInstance.define("coachAthlete", {
    athleteID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    coachID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
});

export default SQLCoachAthlete;
