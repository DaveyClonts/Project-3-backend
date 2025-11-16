import { DataTypes } from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLGoal = SequelizeInstance.define("goal", {
    goalID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATEONLY,
    }
});

export default SQLGoal;
