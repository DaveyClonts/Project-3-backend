import workouts from "../controllers/workout.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Workout
router.post("/", [authenticate], workouts.create);

// Retrieve all Workouts for user
router.get("/coachWorkouts/:coachID", [authenticate], workouts.findAllForCoach);

// Retrieve all Workouts for athlete
router.get("/athleteWorkouts/:athleteID", [authenticate], workouts.findAllForAthlete);

// Retrieve all Workouts for athlete and coach
router.get("/coachAthleteWorkouts/", [authenticate], workouts.findAllForCoachAndAthlete);

// Retrieve a single Workout with id
router.get("/:id", [authenticate], workouts.findOne);

// Update a Workout with id
router.put("/:id", [authenticate], workouts.update);

// Delete a Workout with id
router.delete("/:id", [authenticate], workouts.delete);

export default router;
