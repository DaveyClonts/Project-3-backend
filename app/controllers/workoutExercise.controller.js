import db from "../models/index.js";
import WorkoutExercise from "../classes/workoutExercise.js";

const SQLWorkoutExercise = db.workoutExercise;

export default {
    create: async (req, res) => {
        // Validate request
        if (!req.body.exerciseID) {
            console.error("Content cannot be empty!");

            res.status(400).send({
                message: "Content cannot be empty!",
            });
            return;
        }

        console.log("Creating workout exercise.");

        const exercise = null;
        if (req.body.reps !== undefined)
            exercise = WorkoutExercise.WeightExercise(
                req.body.workoutID,
                req.body.exerciseID,
                req.body.reps,
                req.body.sets,
                req.body.weight
            );
        else
            exercise = WorkoutExercise.CardioExercise(
                req.body.workoutID,
                req.body.exerciseID,
                req.body.miles,
                req.body.time
            );

        // Save Exercise in the database
        SQLWorkoutExercise.create(exercise)
            .then((data) => {
                console.log("Created workout exercise.");
                res.send(data);
            })
            .catch((err) => {
                console.error(
                    "Error creating workout exercise: " + err.message
                );
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Workout.",
                });
            });
    },
    findAllForWorkout: async (req, res) => {
        const workoutID = req.params.workoutID;

        SQLWorkoutExercise.findAll({ where: { workoutID } })
            .then((data) => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `Cannot find Workouts with id=${workoutID}.`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieving Workouts with id=" + workoutID,
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

        console.log("Update: " + JSON.stringify(req.body));

        SQLWorkoutExercise.update(req.body, {
            where: {
                workoutID,
                exerciseID,
            },
        })
            .then((num) => {
                if (num == 1) {
                    console.log("Workout exercise was updated successfully.");

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
                console.log("Error updating workout exercise: " + err);

                res.status(500).send({
                    message:
                        err.message ||
                        "Error updating Workout exercise with id=" + workoutID,
                });
            });
    },
    delete: async (req, res) => {
        const workoutID = req.params.workoutID;
        const exerciseID = req.params.exerciseID;

        SQLWorkoutExercise.destroy({
            where: {
                workoutID,
                exerciseID,
            },
        })
            .then((num) => {
                if (num == 1) {
                    console.log("Workout was deleted successfully.");

                    res.send({
                        message: "Workout was deleted successfully!",
                    });
                } else {
                    console.log(`Cannot delete Workout with id=${workoutID}.`);

                    res.send({
                        message: `Cannot delete Workout with id=${workoutID}. Maybe Workout was not found!`,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    `Error deleting workout with id=${workoutID}: ${err}`
                );

                res.status(500).send({
                    message: `Error deleting workout with id=${workoutID}: ${err}`,
                });
            });
    },
    deleteAllForWorkout: async (req, res) => {
        const workoutID = req.params.workoutID;

        console.log("Delete all for workout");

        SQLWorkoutExercise.destroy({
            where: {
                workoutID,
            },
        })
            .then((num) => {
                if (num == 1) {
                    console.log("Workouts were deleted successfully.");

                    res.send({
                        message: "Workouts were deleted successfully!",
                    });
                } else {
                    console.log(`Cannot delete Workouts with id=${workoutID}.`);

                    res.send({
                        message: `Cannot delete Workouts with id=${workoutID}. Maybe Workouts were not found!`,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    `Error deleting workouts with id=${workoutID}: ${err}`
                );

                res.status(500).send({
                    message: `Error deleting workouts with id=${workoutID}: ${err}`,
                });
            });
    },
};
