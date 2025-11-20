import exercises from "../controllers/exercise.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Exercise
router.post("/", [authenticate], exercises.create);

// Retrieve all Exercises for user
router.get("/userExercises/:userID", [authenticate], exercises.findAllForUser);

// Retrieve a single Exercise with id
router.get("/:id", [authenticate], exercises.findOne);

// Update a Exercise with id
router.put("/:id", [authenticate], exercises.update);

// Delete a Exercise with id
router.delete("/:id", [authenticate], exercises.delete);

export default router;
