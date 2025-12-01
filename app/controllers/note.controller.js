import db from "../models/index.js";

const SQLNote = db.note;
const Op = db.Sequelize.Op;

export default {
    create: async (req, res) => {
        // Validate request
        if (!req.body.note) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }

        const note = {
            note: req.body.note,
            date: req.body.date,
            goalID: req.body.goalID,
        };

        // Save Note in the database
        SQLNote.create(note)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Note.",
                });
            });
    },
    getAll: async (req, res) => {
        const goalID = req.params.goalID;
        
        SQLNote.findAll({ where: { goalID: goalID } })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving Notes.",
                });
            });
    },
};
