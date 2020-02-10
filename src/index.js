const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;

const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1_000_000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a Word document'))
        }
        cb(undefined, true);
        //cb(new Error("File must be a PDF"))
    }

});

const errorMiddleware = (req, res) => {
    throw new Error("From Middleware");
};

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Start server and bring up port.
app.listen(port, () => {
    console.log("Server is up on port " + port)
});