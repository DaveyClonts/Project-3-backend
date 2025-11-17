import { Sequelize } from "sequelize";
import sequelize from "../config/sequelizeInstance.js";

import SQLUser from "./user.model.js";
import SQLSession from "./session.model.js";
import SQLExercise from "./exercise.model.js";
import SQLGoal from "./goal.model.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = SQLUser;
db.session = SQLSession;
db.exercise = SQLExercise;
db.goal = SQLGoal;

// foreign key for session
db.user.hasMany(
    db.session,
    { as: "session" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.session.belongsTo(
    db.user,
    { as: "user" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for tutorials
db.user.hasMany(
    db.exercise,
    { as: "tutorial" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.exercise.belongsTo(
    db.user,
    { as: "user" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for goals
db.user.hasMany(
    db.goal,
    { as: "goal" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.goal.belongsTo(
    db.user,
    { as: "user" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

export default db;
