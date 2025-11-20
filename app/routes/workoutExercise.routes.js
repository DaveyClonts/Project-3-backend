import workoutExercises from "../controllers/workoutExercise.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Exercise
router.post("/", [authenticate], workoutExercises.create);

// Retrieve all Exercises for workout
router.get("/:workoutID", [authenticate], workoutExercises.findAllForWorkout);

// Retrieve a single Exercise with id
router.get("/", [authenticate], workoutExercises.findOne);

// Update a Exercise with id
router.put("/", [authenticate], workoutExercises.update);

// Delete a Exercise with id
router.delete("/", [authenticate], workoutExercises.delete);

export default router;
