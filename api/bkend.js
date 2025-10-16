const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Use the promises version for async/await
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to your data file
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Helper function to read tasks from the file
async function readTasks() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        return [];
    }
}

// Helper function to write tasks to the file
async function writeTasks(tasks) {
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

// GET /api/tasks - Read all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await readTasks();
    res.json(tasks);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Task text is required' });
    }
    const tasks = await readTasks();
    const newTask = {
        id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1, // Assign a unique ID
        text,
        done: false,
    };
    tasks.push(newTask);
    await writeTasks(tasks);
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update task status
app.put('/api/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { done } = req.body;
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex].done = done;
    await writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let tasks = await readTasks();
    const initialLength = tasks.length;
    
    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    await writeTasks(tasks);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});