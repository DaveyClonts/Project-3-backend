import db from "../models/index.js";
const Session = db.session;

const authenticate = (req, res, next) => {
    let token = null;

    console.log("Authenticating");
    const authHeader = req.get("authorization");

    if (authHeader != null) {
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7);
            
            Session.findAll({ where: { token: token } })
                .then((data) => {
                    const session = data[0];

                    if (session != null) {
                        console.log(session.expirationDate);

                        if (session.expirationDate >= Date.now()) {
                            next();
                            return;
                        } else
                            return res.status(401).send({
                                message:
                                    "Unauthorized! Expired Token, Logout and Login again",
                            });
                    } else {
                        console.log("Could not find session.");
                        res.status(401).send({
                            message:
                                "Unauthorized! Could not find valid session.",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    res.status(500).send("Error with authorization: " + err);
                });
        }
    } else {
        console.log("Unauthorized! No Auth Header.");
        return res.status(401).send({
            message: "Unauthorized! No Auth Header.",
        });
    }
};

export default authenticate;
