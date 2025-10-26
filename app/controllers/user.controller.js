import db from "../models/index.js";
import User from "../classes/user.js";
const SQLUser = db.user;
const Op = db.Sequelize.Op;

export default userController = {
    create: async (req, res) => {
        // Validate request
        if (!req.body.firstName) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }

        const user = new User(
            req.body.email,
            req.body.firstName,
            req.body.lastName,
            req.body.id
        );

        // Save User in the database
        SQLUser.create(user)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating a User.",
                });
            });
    },
    findAll: async (req, res) => {
        const id = req.query.id;
        var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

        SQLUser.findAll({ where: condition })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving Users.",
                });
            });
    },
    findOne: async (req, res) => {
        const id = req.params.id;

        SQLUser.findByPk(id)
            .then((data) => {
                if (data) {
                    const user = new User(
                        data.email,
                        data.firstName,
                        data.lastName,
                        data.id
                    );

                    res.send(user);
                } else
                    res.status(404).send({
                        message: `Cannot find User with id=${id}.`,
                    });
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Error retrieving User with id=${id}.`,
                });
            });
    },
    findByEmail: async (req, res) => {
        const email = req.params.email;

        SQLUser.findOne({
            where: {
                email: email,
            },
        })
            .then((data) => {
                if (data) {
                    const user = new User(
                        data.email,
                        data.firstName,
                        data.lastName,
                        data.id
                    );

                    res.send(user);
                } else res.send({ email: "not found" });
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Error retrieving User with email=${email}.`,
                });
            });
    },
    update: async (req, res) => {
        const id = req.params.id;

        SQLUser.update(req.body, {
            where: { id: id },
        })
            .then((num) => {
                if (num == 1)
                    res.send({
                        message: "User was updated successfully.",
                    });
                else
                    res.send({
                        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
                    });
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Error updating User with id=${id}.`,
                });
            });
    },
    delete: async (req, res) => {
        const id = req.params.id;

        SQLUser.destroy({
            where: { id: id },
        })
            .then((num) => {
                if (num == 1)
                    res.send({
                        message: "User was deleted successfully!",
                    });
                else
                    res.send({
                        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                    });
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Could not delete User with id=${id}.`,
                });
            });
    },
};
