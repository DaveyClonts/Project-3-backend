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
    let user;

    const email = googleUser.email;
    const firstName = googleUser.firstName;
    const lastName = googleUser.lastName;

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
                    userInfo.id
                );
            } else user = new User(email, firstName, lastName);
        })
        .catch((err) => {
            throw err;
        });

    // this lets us get the user id
    if (user.id === undefined) {
        await SQLUser.create(user)
            .then((data) => {
                const userInfo = data.dataValues;

                return new User(
                    userInfo.email,
                    userInfo.firstName,
                    userInfo.lastName,
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

                return new User(
                    user.email,
                    user.firstName,
                    user.lastName,
                    user.id
                );
            })
            .catch((err) => {
                console.log(`Error updating User with id=${user.id}.`);
                throw err;
            });
    }
}

/**
 * Finds and returns a user with the passed id.
 * @param id
 * @returns {Promise<User>} The found user.
 */
async function findUserByID(id) {
    console.log(`Finding User by id=${req.params.id}.`);

    await SQLUser.findOne({
        where: {
            id: id,
        },
    })
        .then((data) => {
            if (data != null) {
                const userInfo = data.dataValues;

                return new User(
                    userInfo.email,
                    userInfo.firstName,
                    userInfo.lastName,
                    userInfo.id
                );
            }
        })
        .catch((err) => {
            throw err;
        });
}

/**
 * Updates the passed user's session status. If their status is expired, this removes their session and creates a new one. Otherwise, this just creates a new session.
 * @param {User} user The user to update.
 * @returns {User} The user with an updated session token.
 */
async function updateSessionStatus(user) {
    let session;

    await SQLSession.findOne({
        where: {
            email: email,
            token: { [Op.ne]: "" },
        },
    })
        .then(async (data) => {
            if (data !== null) {
                const sessionInfo = data.dataValues;
                session = new Session(
                    sessionInfo.id,
                    sessionInfo.email,
                    sessionInfo.token,
                    sessionInfo.expirationDate
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

                    return User(
                        user.email,
                        user.firstName,
                        user.lastName,
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

    if (session.id !== undefined) return;

    // create a new Session with an expiration date and save to database
    let token = jwt.sign({ id: email }, authconfig.secret, {
        expiresIn: 86400,
    });

    let tempExpirationDate = new Date();
    tempExpirationDate.setDate(tempExpirationDate.getDate() + 1);

    session = new Session(user.id, email, token, tempExpirationDate);

    console.log("Making a new session.");
    console.log(session);

    await SQLSession.create(session)
        .then(() => {
            return new User(
                user.email,
                user.firstName,
                user.lastName,
                user.id,
                token
            );
        })
        .catch((err) => {
            throw err;
        });
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

            let tokenInfo = {
                refresh_token: tokens.refresh_token,
                expiration_date: tempExpirationDate,
            };

            return tokenInfo;
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
    let session;

    await SQLSession.findAll({ where: { token: token } })
        .then((data) => {
            if (data[0] !== undefined) {
                const sessionInfo = data[0].dataValues;
                session = new Session(
                    sessionInfo.id,
                    sessionInfo.email,
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
                console.log("Successfully verified Google token.");
                googleUser = returnUser;
            })
            .catch(console.error);

        // if we don't have their email or name, we need to make another request
        // this is solely for testing purposes
        if (!googleUser.isValid() && req.body.accessToken !== undefined)
            googleUser = getUserForAccessToken(req.body.accessToken);

        await findOrCreateDatabaseUser(googleUser)
            .then((user) => {
                googleUser = user;
            })
            .catch((err) => res.status(500).send({ message: err.message }));

        updateSessionStatus(googleUser)
            .then((userData) => {
                console.log(`Successfully received user data: ${userData}.`);
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
        console.log("Authorizing client.");
        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "postmessage"
        );

        console.log("Authorizing token.");
        // Get access and refresh tokens (if access_type is offline)
        let { tokens } = await oauth2Client.getToken(req.body.code);
        oauth2Client.setCredentials(tokens);

        let user;
        await findUserByID(req.params.id)
            .then((googleUser) => (user = googleUser))
            .catch((err) =>
                console.log(`Failed to find User: ${err.message}.`)
            );

        let tempExpirationDate = new Date();
        tempExpirationDate.setDate(tempExpirationDate.getDate() + 100);

        console.log(tokens);
        console.log(oauth2Client);

        await updateGoogleToken(user)
            .then((tokenInfo) => {
                console.log(tokenInfo);
                res.status(200).send(tokenInfo);
            })
            .catch((err) => {
                console.log(
                    `Error updating User's authentication token: ${err.message}.`
                );
                res.status(500).send(err.message);
            });
    },
    logout: async (req, res) => {
        console.log(req.body);
        if (req.body === null) {
            res.send({
                message: "User has already been successfully logged out!",
            });
            return;
        }

        await deleteSession(req.body.token)
            .then(() => console.log("Successfully logged out."))
            .catch((err) => {
                console.log(`Error logging out: ${err.message}.`);
            });
    },
};
