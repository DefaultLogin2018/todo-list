import React from 'react';

function Task({ task, toggleTask, deleteTask }) {
    return (
        <div className="flex items-center gap-2 p-3 bg-white shadow-lg rounded-lg mb-3 transition-transform transform hover:scale-105 animate-slideIn">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id)}
                className="w-5 h-5 text-blue-500"
            />
            <span className={`text-base ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
        {task.title}
      </span>
            <span className="text-sm text-gray-500 ml-2">{task.deadline}</span>
            <button
                onClick={() => deleteTask(task._id)}
                className="ml-auto p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Delete
            </button>
        </div>
    );
}

export default Task;