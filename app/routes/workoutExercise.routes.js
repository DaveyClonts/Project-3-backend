import workoutExercises from "../controllers/workoutExercise.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Exercise
router.post("/", [authenticate], workoutExercises.create);

// Retrieve a single Exercise with ids
router.get("/:workoutID/:exerciseID", [authenticate], workoutExercises.findOne);

router.get("/:workoutID", [authenticate], workoutExercises.findAllForWorkout);

// Update a Exercise with id
router.put("/", [authenticate], workoutExercises.update);

// Delete a Exercise with id
router.delete("/:workoutID/:exerciseID", [authenticate], workoutExercises.delete);

export default router;
