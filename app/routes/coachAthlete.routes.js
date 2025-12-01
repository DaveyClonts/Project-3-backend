import coachAthlete from "../controllers/coachAthlete.controller.js";
import authenticate from "../authorization/authorization.js";
import { Router } from "express";
var router = Router();

//Create a new coach athlete match
router.post("/", [authenticate], coachAthlete.create);

//Retrieve all Coach Athlete matches for a coach
router.get("/coachAthlete/:coachID", [authenticate], coachAthlete.findAllForCoach);

router.get("/:coachID/:athleteID", [authenticate], coachAthlete.findOne);

//Update a coach athlete match with an id
router.put("/:coachID/:athleteID", [authenticate], coachAthlete.update);

//Delete a coach athlete match with an id
router.delete("/:coachID/:athleteID", [authenticate], coachAthlete.delete);

export default router;