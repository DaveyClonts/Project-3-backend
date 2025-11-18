import { Sequelize } from "sequelize";
import sequelize from "../config/sequelizeInstance.js";

import SQLUser from "./user.model.js";
import SQLSession from "./session.model.js";
import SQLExercise from "./exercise.model.js";
import SQLWorkout from "./workout.model.js";
import SQLWorkoutExercise from "./workoutExercise.model.js";
import SQLGoal from "./goal.model.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = SQLUser;
db.session = SQLSession;
db.exercise = SQLExercise;
db.workout = SQLWorkout;
db.workoutExercise = SQLWorkoutExercise;
db.goal = SQLGoal;

db.user.hasMany(db.session, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
    onDelete: "CASCADE",
});
db.session.belongsTo(db.user, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
});

db.user.hasMany(db.exercise, {
    foreignKey: {
        name: "coachID",
        allowNull: false,
    },
    onDelete: "CASCADE",
});
db.exercise.belongsTo(db.user, {
    foreignKey: {
        name: "coachID",
        allowNull: false,
    },
});

db.user.hasMany(db.goal, {
    as: "goals",
    foreignKey: "userID",
    allowNull: false,
    onDelete: "CASCADE",
});

db.goal.belongsTo(db.user, {
    as: "user",
    foreignKey: "userID",
    allowNull: false,
    onDelete: "CASCADE",
});

export default db;
