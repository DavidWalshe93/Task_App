// Created by David Walshe on 11/02/2020

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/model/user");


const userOneId = new mongoose.Types.ObjectId();
console.log(process.env.JWT_SECRET);
const userOne = {
    _id: userOneId,
    name: "Bob",
    email: "bob@example.ie",
    password: "qwerty2000",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
};

console.log(userOne);

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save()
});

afterEach(() => {

});

test("Should signup a new user", async () => {
    await request(app).post("/users").send({
        name: "John",
        email: "John@example.com",
        password: "MyPass123"
    }).expect(201)
});

test("Should login existing user", async () => {
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
});

test("Should not login nonexistent user", async () => {
    await request(app).post("/users/login").send({
        email: "Hello World",
        password: "bad password"
    }).expect(400)
});

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test("Should not get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
});

test("Should delete user profile", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test("Should delete not delete user profile, unauthorised", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
});