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
    },
    {
        timestamps: false,
    }
);

export default SQLWorkoutExercise;
