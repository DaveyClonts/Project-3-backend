import db from "../models/index.js";
import Goal from "../classes/goal.js";

const SQLGoal = db.goal;
const Op = db.Sequelize.Op;

export default {
    create: async (req, res) => {
        // Validate request
        if (!req.body.name) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }

        const goal = {
            name: req.body.name,
            description: req.body.description ? req.body.description : "",
            date: req.body.date,
            userID: req.body.userID,
        };

        // Save Goal in the database
        SQLGoal.create(goal)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Goal.",
                });
            });
    },
    findAll: async (req, res) => {
        const name = req.query.name;
        var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
        
        SQLGoal.findAll({ where: condition })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving Goals.",
                });
            });
    },
    findAllForUser: async (req, res) => {
        const userID = req.params.userID;
        
        console.log("Finding goals for user: " + req.params.userID);

        SQLGoal.findAll({ where: { userID: userID } })
            .then((data) => {
                if (data) {
                    console.log("Found goals");
                    res.status(200).send(data);
                    return;
                } else {
                    console.log("Could not find goals for user");
                    res.status(404).send({
                        message: `Cannot find Goals for user with id=${userID}.`,
                    });
                    return;
                }
            })
            .catch((err) => {
                console.log("Error retrieving goals: " + err.message);
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Goals for user with id=" + userID,
                });
            });
    },
    update: async (req, res) => {
        const id = req.params.id;

        SQLGoal.update(req.body, {
            where: { goalID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Goal was updated successfully.",
                    });
                } else {
                    res.send({
                        message: `Cannot update Goal with id=${id}. Maybe Goal was not found or req.body is empty!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Error updating Goal with id=" + id,
                });
            });
    },
    delete: async (req, res) => {
        const id = req.params.id;

        SQLGoal.destroy({
            where: { goalID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Goal was deleted successfully!",
                    });
                } else {
                    res.send({
                        message: `Cannot delete Goal with id=${id}. Maybe Goal was not found!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Could not delete Goal with id=" + id,
                });
            });
    },
};
