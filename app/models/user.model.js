import Sequelize from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLUser = SequelizeInstance.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

export default SQLUser;
