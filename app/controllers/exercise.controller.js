import db from "../models/index.js";
import Exercise from "../classes/exercise.js";

const SQLExercise = db.exercise;
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

        const exercise = new Exercise(
            req.body.name,
            req.body.type,
            req.body.description ? req.body.description : "",
            req.body.userId
        );

        // Save Exercise in the database
        SQLExercise.create(exercise)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Exercise.",
                });
            });
    },
    findAll: async (req, res) => {
        const title = req.query.title;
        var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        
        SQLExercise.findAll({ where: condition })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving Exercises.",
                });
            });
    },
    findAllForUser: async (req, res) => {
        const userId = req.params.userId;
        
        SQLExercise.findAll({ where: { userId: userId } })
            .then((data) => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `Cannot find Exercises for user with id=${userId}.`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Exercises for user with id=" + userId,
                });
            });
    },
    findOne: async (req, res) => {
        const id = req.params.id;

        SQLExercise.findByPk(id)
            .then((data) => {
                if (data) {
                    const exercise = new Exercise(
                        data.name,
                        data.type,
                        data.description,
                        data.userId
                    );

                    res.send(exercise);
                } else {
                    res.status(404).send({
                        message: `Cannot find Exercise with id=${id}.`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Exercise with id=" + id,
                });
            });
    },
    update: async (req, res) => {
        const id = req.params.id;

        SQLExercise.update(req.body, {
            where: { id: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Exercise was updated successfully.",
                    });
                } else {
                    res.send({
                        message: `Cannot update Exercise with id=${id}. Maybe Exercise was not found or req.body is empty!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Error updating Exercise with id=" + id,
                });
            });
    },
    delete: async (req, res) => {
        const id = req.params.id;

        SQLExercise.destroy({
            where: { id: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Exercise was deleted successfully!",
                    });
                } else {
                    res.send({
                        message: `Cannot delete Exercise with id=${id}. Maybe Exercise was not found!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Could not delete Exercise with id=" + id,
                });
            });
    },
};
