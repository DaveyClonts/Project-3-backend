import { Sequelize } from "sequelize";
import sequelize from "../config/sequelizeInstance.js";

import SQLUser from "./user.model.js";
import SQLSession from "./session.model.js";
import Tutorial from "./tutorial.model.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = SQLUser;
db.session = SQLSession;
db.tutorial = Tutorial;

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
    db.tutorial,
    { as: "tutorial" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.tutorial.belongsTo(
    db.user,
    { as: "user" },
    { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

export default db;
