// Created by David Walshe on 10/02/2020

const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY;

sgMail = require('@sendgrid/mail');

sgMail.setApiKey(SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'david.walshe93@gmail.com',
        subject: "Welcome",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
};


const sendExitEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'david.walshe93@gmail.com',
        subject: "Thanks and Goodbye",
        text: `Sorry to see you go ${name}. Was their any reason in particular you are leaving us?.`
    })
};


module.exports = {
    sendWelcomeEmail,
    sendExitEmail
};
