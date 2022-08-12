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
        next(err);
    }
})

router.get('/:name/tasks', (req, res, next) => {
    try {
        if (!todos.listPeople().includes(req.params.name)) {
            res.sendStatus(404);
            throw new Error('page not found 404');
        }

        const status = req.query.status;
        let tasks;
        if (status !== undefined) {
            tasks = todos.list(req.params.name).filter(task => {
                if (status === 'complete' && task.complete === true) {
                    return true;
                } else if (status === 'active' && task.complete === false) {
                    return true;
                }
                return false;
            });
        } else {
            tasks = todos.list(req.params.name);
        }
        res.send(tasks);
    } catch (err) {
        next(err);
    }
})

router.post('/:name/tasks', (req, res, next) => {
    try {
        if (req.body.content === '') {
            res.sendStatus(400);
            throw new Error('code 400');
        }
        todos.add(req.params.name, req.body);
        res.type('application/json')
        res.status(201).json(todos.list(req.params.name)[0]);
    } catch(err) {
        next(err);
    }
})

router.put('/:user/tasks/:index', (req, res, next) => {
    try {
        todos.complete(req.params.user, req.params.index);
        res.send(`/${req.params.user}/tasks`);
    } catch (err) {
        next(err);
    }
})

router.delete('/:user/tasks/:index', (req, res, next) => {
    try {
        todos.remove(req.params.user, req.params.index);
        res.status(204).send(`/${req.params.user}/tasks`);
    } catch (err) {
        next(err);
    }
})