const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'zeliboba_amogus_123';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deadline: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.model('Task', taskSchema);

// Middleware to verify JWT
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId);
        if (!req.user) return res.status(401).json({ error: 'Invalid token' });
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Routes
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, email: user.email }); // Добавляем email в ответ
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json(tasks);
    } catch (err) {
        console.error('GET /tasks error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        console.error('GET /tasks/:id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/tasks', authMiddleware, async (req, res) => {
    try {
        const { title, deadline } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        const task = new Task({ title, deadline, userId: req.user._id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error('POST /tasks error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { completed },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        console.error('PUT /tasks/:id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(204).send();
    } catch (err) {
        console.error('DELETE /tasks/:id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));