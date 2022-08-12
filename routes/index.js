const express = require('express');
const router = express.Router();
const app = require('../app');
const todos = require('../models/express-models/todos');
module.exports = router;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// write your routes here. Feel free to split into multiple files if you like.

router.get('/', (req, res, next) => {
    try {
        res.send(todos.listPeople());
    } catch(err) {
        console.error(err);
        next();
    }
})

router.get('/:name/tasks', (req, res, next) => {
    try {
        if (!todos.listPeople().includes(req.params.name)) {
            res.status(404);
            throw new Error('page not found 404');
        }
        res.send(todos.list(req.params.name));
    } catch (err) {
        console.error(err);
        next();
    }
})


router.post('/:name/tasks', (req, res, next) => {
    try {
        if (req.body.content === '') {
            res.sendStatus(400);
        }
        todos.add(req.params.name, req.body);
        res.type('application/json')
        res.status(201).json(todos.list(req.params.name)[0]);
    } catch(err) {
        console.log('\n\n\nwe got an error!')
        console.error(err);
        next();
    }
})