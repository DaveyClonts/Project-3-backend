import goal from "../controllers/goal.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Goal
router.post("/", [authenticate], goal.create);

// Retrieve all Goal for user
router.get("/:userID", [authenticate], goal.findAllForUser);

// Update a Goal with id
router.put("/:id", [authenticate], goal.update);

// Delete a Goal with id
router.delete("/:id", [authenticate], goal.delete);

export default router;
