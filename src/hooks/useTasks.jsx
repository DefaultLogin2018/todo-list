import { useState, useEffect, useCallback } from 'react';

function useTasks(isAuthenticated) {
    const [tasks, setTasks] = useState([]);

    const isValidToken = () => {
        const token = localStorage.getItem('token');
        return isAuthenticated && token;
    };

    const fetchTasks = useCallback(async () => {
        if (!isValidToken()) {
            setTasks([]);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.status}`);
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            console.error('Error fetching tasks:', err.message);
            setTasks([]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = async (title, deadline) => {
        if (!isValidToken()) return;
        try {
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, deadline }),
            });
            if (!response.ok) throw new Error(`Failed to add task: ${response.status}`);
            const newTask = await response.json();
            setTasks((prev) => [...prev, newTask]);
        } catch (err) {
            console.error('Error adding task:', err.message);
        }
    };

    const toggleTask = async (id) => {
        if (!isValidToken()) return;
        try {
            const task = tasks.find((t) => t._id === id);
            if (!task) return;
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !task.completed }),
            });
            if (!response.ok) throw new Error(`Failed to toggle task: ${response.status}`);
            const updatedTask = await response.json();
            setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
        } catch (err) {
            console.error('Error toggling task:', err.message);
        }
    };

    const deleteTask = async (id) => {
        if (!isValidToken()) return;
        try {
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error(`Failed to delete task: ${response.status}`);
            setTasks((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error('Error deleting task:', err.message);
        }
    };

    return { tasks, addTask, toggleTask, deleteTask, fetchTasks, setTasks };
}

export default useTasks;