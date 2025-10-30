import { Sequelize } from "sequelize";
import sequelize from "../config/sequelizeInstance.js";

import SQLUser from "./user.model.js";
import SQLSession from "./session.model.js";
import SQLExercise from "./exercise.model.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = SQLUser;
db.session = SQLSession;
db.exercise = SQLExercise;

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

export default db;
