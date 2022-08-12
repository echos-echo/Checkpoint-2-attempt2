const express = require('express');
const router = express.Router();
const app = require('../app');
const todos = require('../models/express-models/todos');
module.exports = router;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// write your routes here. Feel free to split into multiple files if you like.

// sends a list of all people who have tasks
router.get('/', (req, res, next) => {
    try {
        res.send(todos.listPeople());
    } catch(err) {
        next(err);
    }
})

// gets a list of all complete/active tasks given a name and status wanted
router.get('/:name/tasks', (req, res, next) => {
    try {
        // error when the name is not found in the list of people
        if (!todos.listPeople().includes(req.params.name)) {
            res.sendStatus(404);
            throw new Error('404: We have an error!');
        }

        // status as in if a task is complete or active (incomplete)
        const status = req.query.status;

        if (status !== undefined) {
            // if a particular status was requested, sends a list of tasks of that status
            res.send(todos.list(req.params.name).filter(task => {
                if (status === 'complete' && task.complete === true) {
                    // will keep all tasks that are complete
                    return true;
                } else if (status === 'active' && task.complete === false) {
                    // will keep all tasks that are incomplete (still active)
                    return true;
                }
                // if the task passed neither of the above, filter it out
                return false;
            }))
        } else {
            // if a particular status was not requested, sends list of ALL tasks
            res.send(todos.list(req.params.name));
        }
    } catch (err) {
        next(err);
    }
})

// sends data and adds a task with some name to tasks
router.post('/:name/tasks', (req, res, next) => {
    try {
        // if there is no content (tasks) data, throws error
        if (req.body.content === '') {
            res.sendStatus(400);
            throw new Error('400: We have an error!');
        }

        // adds the task and user to tasks
        todos.add(req.params.name, req.body);
        res.type('application/json')
        res.status(201).json(todos.list(req.params.name)[0]);
    } catch(err) {
        next(err);
    }
})

// updates the given user's task to complete, given the task's index
router.put('/:user/tasks/:index', (req, res, next) => {
    try {
        // will change the task status using the given user and index, to complete
        todos.complete(req.params.user, req.params.index);
        res.send(`/${req.params.user}/tasks`);
    } catch (err) {
        next(err);
    }
})

// deletes a given user's task of a given index
router.delete('/:user/tasks/:index', (req, res, next) => {
    try {
        // will remove the task associate with the given index from the given user's tasks
        todos.remove(req.params.user, req.params.index);
        res.status(204).send(`/${req.params.user}/tasks`);
    } catch (err) {
        next(err);
    }
})