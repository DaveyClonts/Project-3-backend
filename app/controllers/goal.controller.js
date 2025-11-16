import db from "../models/index.js";
import Goal from "../classes/goal.js";

const SQLGoal = db.goal;
const Op = db.Sequelize.Op;

export default {
    create: async (req, res) => {
        // Validate request
        if (!req.body.title) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }

        const goal = new Goal(
            req.body.name,
            req.body.description ? req.body.description : "",
            req.body.date,
            req.body.userID,
        );

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
        const title = req.query.title;
        var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        
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
        const userId = req.params.userId;
        
        SQLGoal.findAll({ where: { userId: userId } })
            .then((data) => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `Cannot find Goals for user with id=${userId}.`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Goals for user with id=" + userId,
                });
            });
    },
    findOne: async (req, res) => {
        const id = req.params.id;

        SQLGoal.findByPk(id)
            .then((data) => {
                if (data) {
                    const goal = new Goal(
                        data.name,
                        data.description,
                        data.date,
                        data.userID
                    );

                    res.send(goal);
                } else {
                    res.status(404).send({
                        message: `Cannot find Goal with id=${id}.`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Goal with id=" + id,
                });
            });
    },
    update: async (req, res) => {
        const id = req.params.id;

        SQLGoal.update(req.body, {
            where: { id: id },
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
            where: { id: id },
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
