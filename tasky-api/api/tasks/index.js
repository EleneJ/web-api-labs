import express from 'express';
import Task from './taskModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); // eslint-disable-line

// Get a user's tasks
router.get('/', async (req, res) => {
    console.log(req.user);
    const tasks = await Task.find({ userId: `${req.user._id}`});
    res.status(200).json(tasks);
});

// create a task
router.post('/', asyncHandler(async (req, res) => {
    const newTask = req.body;
    newTask.userId = req.user._id;
    const task = await Task(newTask).save();
    res.status(201).json(task);
}));

// Update Task
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await Task.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'Task Updated Successfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
});

// delete Task
router.delete('/:id', async (req, res) => {
    const result = await Task.deleteOne({
        _id: req.params.id,
    });
    if (result.deletedCount) {
        res.status(204).json();
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
});

// Get a user's tasks
router.get('/user/:uid', async (req, res) => {
    const tasks = await Task.find({ userId: `${req.params.uid}`});
    res.status(200).json(tasks);
});

export default router;