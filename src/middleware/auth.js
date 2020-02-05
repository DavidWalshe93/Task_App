// Created by David Walshe on 05/02/2020

const jwt = require("jsonwebtoken");
const User = require(("../model/user"));

const auth = async (req, res, next) => {
    try {
        console.log("HELLO")
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "MY_SECRET");
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});
        console.log(user)
        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next();
        console.log(token)
    } catch (e) {
        res.status(401).send({error: "Please authenticate"})
    }

};

module.exports = auth;