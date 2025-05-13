import { useState } from 'react';

function useTasks() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Buy milk', completed: false, deadline: '2025-05-10' },
        { id: 2, title: 'Walk dog', completed: true, deadline: '2025-05-11' },
    ]);

    const addTask = (title, deadline) => {
        setTasks((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                title,
                completed: false,
                deadline,
            },
        ]);
    };

    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    return { tasks, addTask, toggleTask, deleteTask };
}

export default useTasks;