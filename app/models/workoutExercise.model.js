import { DataTypes } from "sequelize";
import SequelizeInstance from "../config/sequelizeInstance.js";

const SQLWorkoutExercise = SequelizeInstance.define(
    "workoutExercise",
    {
        workoutID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "workouts",
                key: "id",
            },
        },
        exerciseID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "exercises",
                key: "id",
            },
        },
        sets: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        weight: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        miles: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    },
    {
        timestamps: false,
    }
);

export default SQLWorkoutExercise;
