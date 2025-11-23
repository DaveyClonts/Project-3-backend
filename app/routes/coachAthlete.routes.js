import coachAthlete from "../classes/coachAthlete";
import authenticate from "../authorization/authorization";
import { Router } from "express";
var router = Router();

//Create a new coach athlete match
router.post("/", [authenticate], coachAthlete.create);

//Retrieve all Coach Athlete matches for a coach
router.get("/coachAthlete/:coachID", [authenticate], workflowexecutions.findAllForCoach);

//Retrieve a single coach athlete match for an id
router.get(":/id", [authenticate], coachAthlete.findOne);

//Update a coach athlete match with an id
router.put("/:id", [authenticate], coachAthlete.update);

//Delete a coach athlete match with an id
router.delete("/:id", [authenticate], coachAthlete.delete);

export default router;