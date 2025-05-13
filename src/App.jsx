import React from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import useTasks from './hooks/useTasks.jsx';

function App() {
    const { tasks, addTask, toggleTask, deleteTask } = useTasks();

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl mb-4 text-center font-bold">To-Do List</h1>
            <TaskForm addTask={addTask} />
            <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
        </div>
    );
}

export default App;