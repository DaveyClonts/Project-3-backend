import { DataTypes } from "@sequelize/core";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLSession = SequelizeInstance.define("sessions", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING(3000),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

export default SQLSession;
