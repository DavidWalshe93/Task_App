// Created by David Walshe on 12/02/2020

const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/model/task");

const {userOne, userOneId, userTwo, userTwoId, taskOne, setupDatabase} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "From my test"
        })
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false)
});

test("Should return only tasks for userOne", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2)
});

test("Should fail as user 2 does not own task 2", async () => {
    const response = await request(app)
        .delete("/tasks/" + taskOne._id)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    const task = Task.findById(taskOne._id);
    expect(task).not.toBeNull()
});

