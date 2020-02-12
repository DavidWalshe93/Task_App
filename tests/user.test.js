// Created by David Walshe on 11/02/2020

const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/user");

const {userOne, userOneId, setupDatabase} = require("./fixtures/db");


beforeEach(setupDatabase);

afterEach(() => {

});

test("Should signup a new user", async () => {
    const response = await request(app).post("/users").send({
        name: "John",
        email: "John@example.com",
        password: "MyPass123"
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the
    expect(response.body).toMatchObject({
        user: {
            name: "John",
            email: "john@example.com",
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe("MyPass123")


});

test("Should login existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId);

    expect(response.body.token).toBe(user.tokens[1].token)

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
    const response = await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test("Should delete not delete user profile, unauthorised", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
});

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
});

test("Should update valid user fields", async () => {
    const response = await request(app)
        .patch("/users/me/")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 24,
            name: "Luke"
        }).expect(200);

    expect(response.body.age).toBe(24);
    expect(response.body.name).toBe("Luke");
});

test("Should not update invalid user fields", async () => {
    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Hello World",
            age: 24,
            name: "Luke"
        }).expect(400);
});