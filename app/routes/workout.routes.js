import workouts from "../controllers/workout.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Exercise
router.post("/", [authenticate], workouts.create);

// Retrieve all Exercises for user
router.get("/userWorkouts/:userId", [authenticate], workouts.findAllForUser);

// Retrieve a single Exercise with id
router.get("/:id", [authenticate], workouts.findOne);

// Update a Exercise with id
router.put("/:id", [authenticate], workouts.update);

// Delete a Exercise with id
router.delete("/:id", [authenticate], workouts.delete);

export default router;
