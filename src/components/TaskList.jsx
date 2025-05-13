import React from 'react';
import Task from './Task.jsx';

function TaskList({ tasks, toggleTask, deleteTask }) {
    return (
        <div className="flex flex-col gap-2">
            {tasks.length ? (
                tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        toggleTask={toggleTask}
                        deleteTask={deleteTask}
                    />
                ))
            ) : (
                <p className="text-gray-500 text-center">No tasks yet</p>
            )}
        </div>
    );
}

export default TaskList;