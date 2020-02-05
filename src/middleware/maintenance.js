// Created by David Walshe on 05/02/2020

// Enables maintenance mode
const maintenance = (req, res, next) => {
    if (process.env.MAINTENANCE === "1") {
        console.log("Currently in maintenance mode");
        res.status("503").send("Service is currently under maintenance")
    } else {
        next()
    }
};

module.exports = maintenance;