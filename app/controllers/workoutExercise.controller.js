import db from "../models/index.js";
import WorkoutExercise from "../classes/workoutExercise.js";

const SQLWorkoutExercise = db.workoutExercise;

export default {
    create: async (req, res) => {
        // Validate request
        if (!req.body.workoutID) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }

        const workout = new WorkoutExercise(req.body.workoutID, req.body.date);

        // Save Exercise in the database
        SQLWorkoutExercise.create(workout)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Workout.",
                });
            });
    },
    findAllForWorkout: async (req, res) => {
        const workoutID = req.params.workoutID;

        SQLWorkoutExercise.findAll({ where: { workoutID: workoutID } })
            .then((data) => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `Cannot find Workouts for user with id=${workoutID}.`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Workouts for user with id=" + workoutID,
                });
            });
    },
    findOne: async (req, res) => {
        const workoutID = req.params.workoutID;
        const exerciseID = req.params.exerciseID;

        SQLWorkoutExercise.findOne({
            where: {
                workoutID,
                exerciseID,
            },
        })
            .then((data) => {
                if (data) {
                    const workout = new WorkoutExercise(
                        data.workoutID,
                        data.exerciseID
                    );

                    res.send(workout);
                } else {
                    res.status(404).send({
                        message: `Cannot find Workout with id=${workoutID}.`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Workout with id=" + workoutID,
                });
            });
    },
    update: async (req, res) => {
        const workoutID = req.body.workoutID;
        const exerciseID = req.body.exerciseID;

        SQLWorkoutExercise.update(req.body, {
            where: {
                workoutID,
                exerciseID,
            },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Workout was updated successfully.",
                    });
                } else {
                    res.send({
                        message: `Cannot update Workout with id=${workoutID}. Maybe Workout was not found or req.body is empty!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error updating Exercise with id=" + workoutID,
                });
            });
    },
    delete: async (req, res) => {
        const workoutID = req.body.workoutID;
        const exerciseID = req.body.exerciseID;

        SQLWorkoutExercise.destroy({
            where: {
                workoutID,
                exerciseID,
            },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Workout was deleted successfully!",
                    });
                } else {
                    res.send({
                        message: `Cannot delete Workout with id=${workoutID}. Maybe Workout was not found!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Could not delete Workout with id=" + workoutID,
                });
            });
    },
};
