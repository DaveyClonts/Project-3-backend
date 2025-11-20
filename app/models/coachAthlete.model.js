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
        references: {
            model: 'users',
            key: 'id',
        }
    },
    coachID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    }
});

export default SQLCoachAthlete;