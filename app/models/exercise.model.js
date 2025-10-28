import { DataTypes } from "@sequelize/core";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLExercise = SequelizeInstance.define("exercise", {
    name: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM("cardio, weights"),
    },
    description: {
        type: DataTypes.STRING,
    },
    userID: {
        type: DataTypes.INTEGER
    },
});

export default SQLExercise;
