import { DataTypes } from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLExercise = SequelizeInstance.define("exercise", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM("cardio, weights"),
    },
    description: {
        type: DataTypes.STRING,
    },
});

export default SQLExercise;
