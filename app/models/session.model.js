import { DataTypes } from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLSession = SequelizeInstance.define(
    "sessions",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING(3000),
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export default SQLSession;
