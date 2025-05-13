import React from 'react';

function Task({ task, toggleTask, deleteTask }) {
    return (
        <div className="flex items-center gap-2 p-2 bg-white shadow-md rounded-lg mb-2">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="mr-2"
            />
            <span className="text-base">{task.title}</span>
            <button
                onClick={() => deleteTask(task.id)}
                className="ml-auto text-red-500 hover:text-red-700 text-sm"
            >
                Delete
            </button>
        </div>
    );
}

export default Task;