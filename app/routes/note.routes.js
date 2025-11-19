import note from "../controllers/note.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

// Create a new Note
router.post("/", [authenticate], note.create);

// Retrieve all Notes for goal
router.get("/:goalID", [authenticate], note.getAll);

export default router;
