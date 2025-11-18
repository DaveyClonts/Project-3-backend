import { DataTypes } from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLExercise = SequelizeInstance.define(
    "exercise",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("cardio, weights"),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
    }
);

export default SQLExercise;
