import db from "../models/index.js";
import authconfig from "../config/auth.config.js";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import User from "../classes/user.js";
import Session from "../classes/session.js";
import jwt from "jsonwebtoken";

const SQLUser = db.user;
const SQLSession = db.session;
const Op = db.Sequelize.Op;
const googleID = process.env.CLIENT_ID;

/**
 * Verifies a passed Google token.
 * @param googleToken The token to use.
 * @returns {Promise<User>} The response user.
 */
async function verifyToken(googleToken) {
    const client = new OAuth2Client(googleID);
    const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: googleID,
    });

    const payload = ticket.getPayload();

    return new User(payload.email, payload.given_name, payload.family_name);
}

/**
 * Creates a new user for a passed access token.
 * @param {string} accessToken The token defined in the access request's body.
 * @returns {Promise<User>} A promise for the newly created user.
 */
async function getUserForAccessToken(accessToken) {
    const oauth2Client = new OAuth2Client(googleID); // create new auth client
    oauth2Client.setCredentials({ access_token: accessToken }); // use the new auth client with the access_token

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
    });

    const { data } = await oauth2.userinfo.get(); // get user info
    console.log(data);

    return new User(data.email, data.given_name, data.family_name);
}

/**
 * Finds or creates a user in the database with the same data as the passed User.
 * @param {Promise<User>} googleUser The user object to search with.
 * @returns {Promise<User>} The valid database user.
 */
async function findOrCreateDatabaseUser(googleUser) {
    let user = {};

    const email = googleUser.email;
    const firstName = googleUser.firstName;
    const lastName = googleUser.lastName;
    const role = "coach";

    await SQLUser.findOne({
        where: {
            email: email,
        },
    })
        .then((data) => {
            if (data != null) {
                const userInfo = data.dataValues;
                user = new User(
                    userInfo.email,
                    userInfo.firstName,
                    userInfo.lastName,
                    userInfo.role,
                    userInfo.id
                );
            } else user = new User(email, firstName, lastName, role);
        })
        .catch((err) => {
            throw err;
        });

    // this lets us get the user id
    if (user.id === undefined) {
        await SQLUser.create(user)
            .then((data) => {
                const userInfo = data.dataValues;

                user = new User(
                    userInfo.email,
                    userInfo.firstName,
                    userInfo.lastName,
                    userInfo.role,
                    userInfo.id
                );
            })
            .catch((err) => {
                throw err;
            });
    } else {
        // doing this to ensure that the user's name is the one listed with Google
        user.firstName = firstName;
        user.lastName = lastName;

        await SQLUser.update(user, { where: { id: user.id } })
            .then((num) => {
                if (num == 1)
                    console.log(
                        `Updated User's name: ${firstName} ${lastName}.`
                    );
                else
                    console.log(
                        `Cannot update User with id=${user.id}. Maybe User was not found or request body was empty!`
                    );

                user = new User(
                    user.email,
                    user.firstName,
                    user.lastName,
                    user.role,
                    user.id
                );
            })
            .catch((err) => {
                console.log(`Error updating User with id=${user.id}.`);
                throw err;
            });
    }

    return user;
}

/**
 * Finds and returns a user with the passed id.
 * @param id
 * @returns {Promise<User>} The found user.
 */
async function findUserByID(id) {
    let user = {};
    console.log(`Finding User by id=${id}.`);

    await SQLUser.findOne({
        where: {
            id: id,
        },
    })
        .then((data) => {
            if (data != null) {
                const userInfo = data.dataValues;

                user = new User(
                    userInfo.email,
                    userInfo.firstName,
                    userInfo.lastName,
                    userInfo.role,
                    userInfo.id
                );
            }
        })
        .catch((err) => {
            throw err;
        });

    return user;
}

/**
 * Updates the passed user's session status. If their status is expired, this removes their session and creates a new one. Otherwise, this just creates a new session.
 * @param {User} user The user to update.
 * @returns {User} The user with an updated session token.
 */
async function updateSessionStatus(user) {
    let session = {};
    let authenticatedUser = {};

    await SQLSession.findOne({
        where: {
            userID: user.id,
            token: { [Op.ne]: "" },
        },
    })
        .then(async (data) => {
            if (data !== null) {
                const sessionInfo = data.dataValues;

                session = new Session(
                    sessionInfo.userID,
                    sessionInfo.token,
                    sessionInfo.expirationDate,
                    sessionInfo.role, 
                    sessionInfo.id
                );

                if (session.expirationDate < Date.now()) {
                    session.token = "";

                    // clear session's token if it's expired
                    await SQLSession.update(session, {
                        where: { id: session.id },
                    })
                        .then((num) => {
                            if (num == 1)
                                console.log("Successfully logged out.");
                            else throw new Error("Error logging out user.");
                        })
                        .catch((err) => {
                            throw err;
                        });

                    //reset session to be null since we need to make another one
                    session = {};
                } else {
                    console.log(
                        "Found a session, don't need to make another one."
                    );

                    authenticatedUser = new User(
                        user.email,
                        user.firstName,
                        user.lastName,
                        user.role,
                        user.id,
                        session.token
                    );
                }
            }
        })
        .catch((err) => {
            throw new Error(
                err.message || "Some error occurred while retrieving sessions."
            );
        });

    if (authenticatedUser.firstName !== undefined) return authenticatedUser;

    if (session.id !== undefined) return;

    // create a new Session with an expiration date and save to database
    let token = jwt.sign({ id: user.email }, authconfig.secret, {
        expiresIn: 86400,
    });

    let tempExpirationDate = new Date();
    tempExpirationDate.setDate(tempExpirationDate.getDate() + 1);

    session = new Session(user.id, token, tempExpirationDate);

    console.log("Making a new session.");
    console.log(session);

    await SQLSession.create(session)
        .then(() => {
            authenticatedUser = new User(
                user.email,
                user.firstName,
                user.lastName,
                user.role,
                user.id,
                token
            );
        })
        .catch((err) => {
            throw err;
        });

    return authenticatedUser;
}

/**
 * Updates the passed user's Google authentication token.
 * @param {User} user The user to update.
 * @returns {object} POJO with token info to send in the response.
 */
async function updateGoogleToken(user) {
    await SQLUser.update(user, { where: { id: user.id } })
        .then((num) => {
            if (num == 1) console.log("Updated User's Google token.");
            else
                console.log(
                    `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`
                );
        })
        .catch((err) => {
            throw err;
        });
}

/**
 * Deletes a session with the passed token.
 * @param {string} token
 */
async function deleteSession(token) {
    let session = {};

    await SQLSession.findAll({ where: { token: token } })
        .then((data) => {
            if (data[0] !== undefined) {
                const sessionInfo = data[0].dataValues;
                session = new Session(
                    sessionInfo.id,
                    sessionInfo.token,
                    sessionInfo.expirationDate
                );
            }
        })
        .catch((err) => {
            throw err;
        });

    session.token = "";

    // session won't be null but the id will if no session was found
    if (session.id !== undefined) {
        SQLSession.update(session, { where: { id: session.id } })
            .then((num) => {
                if (num == 1) console.log("Successfully logged out.");
                else console.log("Failed to log out.");
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        console.log("Already logged out.");
    }
}

/**
 * A collection of authorization functions for Google authentication: 'login', 'authorize', and 'logout.'
 */
export default {
    login: async (req, res) => {
        const googleToken = req.body.credential;
        let googleUser;

        await verifyToken(googleToken)
            .then((returnUser) => {
                console.log(
                    `Successfully verified Google token: ${Object.entries(
                        returnUser
                    )}.`
                );
                googleUser = returnUser;
            })
            .catch(console.error);

        if (googleUser == null) {
            console.error("Could not verify user token!");
            res.status(500).send({ message: "Could not verify user token!" });
            return;
        }

        // if we don't have their email or name, we need to make another request
        // this is solely for testing purposes
        if (!googleUser.isValid() && req.body.accessToken !== undefined)
            googleUser = getUserForAccessToken(req.body.accessToken);

        await findOrCreateDatabaseUser(googleUser)
            .then((user) => {
                googleUser = user;
            })
            .catch((err) => {
                console.log(`Error while retrieving database user: ${err}.`);
                res.status(500).send({ message: err.message });
            });

        await updateSessionStatus(googleUser)
            .then((userData) => {
                console.log(
                    `Successfully received user data: ${JSON.stringify(
                        userData
                    )}.`
                );

                res.status(200).send(userData);
            })
            .catch((err) => {
                console.log(
                    `Error while updating session status: ${err.message}.`
                );
                res.status(500).send({
                    message: `Error while updating session status: ${err.message}.`,
                });
            });
    },
    authorize: async (req, res) => {
        let user;

        await findUserByID(req.body.id)
            .then((googleUser) => (user = googleUser))
            .catch((err) => {
                console.log(`Failed to find User: ${err.message}.`);
                res.status(500).send(`Failed to find User: ${err.message}.`);
            });

        if (user == null) return;

        await updateGoogleToken(user)
            .then(() => {
                res.status(200).send({});
            })
            .catch((err) => {
                console.log(
                    `Error updating User's authentication token: ${err.message}.`
                );
                res.status(500).send(err.message);
            });
    },
    logout: async (req, res) => {
        console.log(`Logout request body: ${JSON.stringify(req.body)}.`);
        if (req.body === null || req.body.credential === undefined) {
            res.status(200).send({
                message: "User has already been successfully logged out!",
            });
            return;
        }

        await deleteSession(req.body.credential)
            .then(() => {
                console.log("Successfully logged out.");
                res.status(200).send({ message: "Successfully logged out." });
            })
            .catch((err) => {
                console.log(`Error logging out: ${err.message}.`);
                res.status(500).send({
                    message: `Error logging out: ${err.message}.`,
                });
            });
    },
};
