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
            req.body.athleteID,
        );

        //Save the CoachAthlete (match) in the database
        SQLCoachAthlete.create(coachAthlete) 
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
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
                { model: db.user, as: "coach"},
                // { model: db.user, as: "athlete"},
            ]
        })
            .then((data) => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: "Cannont find Coach Athlete Match for Coach with userID = " + coachID,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: 
                        err.message ||
                        "Error retrieveing Coach Athlete match for user with id = " + coachID,
                });
            });
    },
    findOne: async (req, res) => {
        const id = req.params.id;

        SQLCoachAthlete.findByPk(id)
            .then((data) => {
                if (data) {
                    //maybe want different data?
                    const coachAthlete = new CoachAthlete(data.id, data.AthleteID);

                    res.send(coachAthlete);
                } else {
                    res.status(404).send({
                        message: 'Cannont find coach athlete match with id = ' + id,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Error retrieving coach athlete match with id=" + id,
                });
            });
    },
    update: async (req, res) => {
        const id = req.params.id;

        SQLCoachAthlete.update(req.body, {
            where: { id: id },
        })
            .then((num) => {
                //num is apparently the number of rows? So if there is one new row after update
                if (num == 1) {
                    res.send({
                        message: "Coach Athlete Match was updated successfully",
                    });
                } else {
                    res.send({
                        message: `Cannot update Coach Athlete Match with id = ${id}. Maybe Match was not found or req.body is empty`
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
        const id = req.params.id;

        SQLCoachAthlete.destroy({
            where: { id: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Coach Athlete Match was deleted successfully!",
                    });
                } else {
                    res.send({
                        message: `Cannot delete Coach Athlete Match with id=${id}. Maybe Match was not found!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Could not delete Coach Athlete Match with id=" + id,
                });
            });
    },
}