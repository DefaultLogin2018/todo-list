import { useState, useEffect, useCallback } from 'react';

function useTasks(isAuthenticated) {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated) {
            setTasks([]);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setTasks([]);
                return;
            }
            const response = await fetch('http://localhost:5000/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setTasks([]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = async (title, deadline) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, deadline }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const newTask = await response.json();
            setTasks((prev) => [...prev, newTask]);
        } catch (err) {
            console.error('Error adding task:', err);
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find((t) => t._id === id);
            if (!task) throw new Error('Task not found');
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !task.completed }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const updatedTask = await response.json();
            setTasks((prev) =>
                prev.map((t) => (t._id === id ? updatedTask : t))
            );
        } catch (err) {
            console.error('Error toggling task:', err);
        }
    };

    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            setTasks((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    return { tasks, addTask, toggleTask, deleteTask, fetchTasks };
}

export default useTasks;