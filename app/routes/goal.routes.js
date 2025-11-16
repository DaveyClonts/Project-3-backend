import goal from "../controllers/goal.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Exercise
router.post("/", [authenticate], goal.create);

// Retrieve all Goal
router.get("/", [authenticate], goal.findAll);

// Retrieve all Goal for user
router.get("/userGoal/:userId", [authenticate], goal.findAllForUser);

// Retrieve a single Exercise with id
router.get("/:id", [authenticate], goal.findOne);

// Update a Exercise with id
router.put("/:id", [authenticate], goal.update);

// Delete a Exercise with id
router.delete("/:id", [authenticate], goal.delete);

export default router;
