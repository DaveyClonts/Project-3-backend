import db from "../models/index.js";
import Exercise from "../classes/exercise.js";
import SQLWorkout from "../models/workout.model.js";

const SQLExercise = db.exercise;

export default {
    create: async (req, res) => {
        // Validate request
        if (!req.body.name) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }

        if (req.body.type == undefined) {
            res.status(500).send({ message: "Exercise requires a type!" });
            return;
        }

        const exercise = new Exercise(
            req.body.name,
            req.body.type.toUpperCase(),
            req.body.description ? req.body.description : "",
            req.body.coachID
        );

        console.log("Request: " + JSON.stringify(exercise));

        // Save Exercise in the database
        SQLExercise.create(exercise)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.log("Error creating exercise: " + err);

                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Exercise.",
                });
            });
    },
    findAllForUser: async (req, res) => {
        const coachID = req.params.userID;
        
        SQLExercise.findAll({ where: { coachID: coachID } })
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
