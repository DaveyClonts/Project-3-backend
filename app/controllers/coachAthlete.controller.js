import db from "../models/index.js";
import CoachAthlete from "../classes/coachAthlete.js";

const SQLCoachAthlete = db.coachAthlete;

export default {
    create: async (req, res) => {
        //Validation
        if (!req.body.coachID) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }

        //create a CoachAthlete (match)
        const coachAthlete = new CoachAthlete(
            req.body.coachID,
            req.body.athleteID
        );

        //Save the CoachAthlete (match) in the database
        SQLCoachAthlete.create(coachAthlete)
            .then((data) => {
                console.log("Successfully created coach athlete.");
                res.send(data);
            })
            .catch((err) => {
                console.error("Error creating coach athlete: " + err);

                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occured while creating the Coach Athlete Match",
                });
            });
    },
    findAllForCoach: async (req, res) => {
        const coachID = req.params.coachID; //gets ID from url

        //filter for user with an id = to coachID
        SQLCoachAthlete.findAll({
            // include: [
            //     { model: db.user, as: "coach", where: { id: coachID}}
            // ],
            where: { coachID },
            include: [
                // { model: db.user, as: "coach"},
                { model: db.user, as: "athlete" },
            ],
        })
            .then((data) => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message:
                            "Cannont find Coach Athlete Match for Coach with userID = " +
                            coachID,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Error retrieveing Coach Athlete match for user with id = " +
                            coachID,
                });
            });
    },
    findOne: async (req, res) => {
        const coachID = req.params.coachID;
        const athleteID = req.params.athleteID;

        SQLCoachAthlete.find({
            where: {
                coachID,
                athleteID,
            },
        }).then((data) => {
            if (data) {
                const coachAthlete = new CoachAthlete(
                    data.coachID,
                    data.athleteID
                );

                res.send(coachAthlete);
            }
        });
    },
    update: async (req, res) => {
        const coachID = req.params.coachID;
        const athleteID = req.params.athleteID;

        SQLCoachAthlete.update(req.body, {
            where: { coachID, athleteID },
        })
            .then((num) => {
                //num is apparently the number of rows? So if there is one new row after update
                if (num == 1) {
                    res.send({
                        message: "Coach Athlete Match was updated successfully",
                    });
                } else {
                    res.send({
                        message: `Cannot update Coach Athlete Match with id = ${id}. Maybe Match was not found or req.body is empty`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Error updating Exercise with id=" + id,
                });
            });
    },
    delete: async (req, res) => {
        const coachID = req.params.coachID;
        const athleteID = req.params.athleteID;

        SQLCoachAthlete.destroy({
            where: { coachID, athleteID },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message:
                            "Coach Athlete Match was deleted successfully!",
                    });
                } else {
                    res.send({
                        message: `Cannot delete Coach Athlete Match with id=${coachID}. Maybe Match was not found!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Could not delete Coach Athlete Match with id=" +
                            coachID,
                });
            });
    },
};
