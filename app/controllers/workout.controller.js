import db from "../models/index.js";
import Workout from "../classes/workout.js";

const SQLWorkout = db.workout;

export default {
  create: async (req, res) => {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    const workout = new Workout(req.body.name, req.body.date, req.body.coachID, req.body.athleteID);

    // Save Exercise in the database
    SQLWorkout.create(workout)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Workout.",
        });
      });
  },
  findAllForCoach: async (req, res) => {
    const userID = req.params.coachID;

    SQLWorkout.findAll({
      include: [
        { model: db.user, as: "coach", where: { id: userID } },
        { model: db.user, as: "athlete" }, 
      ],
    })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Workouts for user with id=${userID}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Error retrieving Workouts for user with id=" + userID,
        });
      });
  },
  findAllForAthlete: async (req, res) => {
    const userID = req.params.athleteID;

    SQLWorkout.findAll({
      include: [
        { model: db.user, as: "athlete", where: { id: userID } },
        { model: db.user, as: "coach" }, 
      ],
    })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Workouts for user with id=${userID}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Error retrieving Workouts for user with id=" + userID,
        });
      });
  },
  findOne: async (req, res) => {
    const id = req.params.id;

    SQLWorkout.findByPk(id)
      .then((data) => {
        if (data) {
          const workout = new Workout(data.name, data.date);

          res.send(workout);
        } else {
          res.status(404).send({
            message: `Cannot find Workout with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error retrieving Workout with id=" + id,
        });
      });
  },
  update: async (req, res) => {
    const id = req.params.id;

    SQLWorkout.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Workout was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Workout with id=${id}. Maybe Workout was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating Exercise with id=" + id,
        });
      });
  },
  delete: async (req, res) => {
    const id = req.params.id;

    SQLWorkout.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Workout was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete Workout with id=${id}. Maybe Workout was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete Workout with id=" + id,
        });
      });
  },
};
