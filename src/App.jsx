import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import TaskPage from './components/TaskPage.jsx';
import useTasks from './hooks/useTasks.jsx';
import VantaBackground from './components/VantaBackground.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const { tasks, addTask, toggleTask, deleteTask, fetchTasks } = useTasks(isAuthenticated);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('email');
        setIsAuthenticated(!!token);
        setEmail(storedEmail || '');
        if (token) fetchTasks();
    }, [fetchTasks]);

    const handleLogin = (userEmail) => {
        setIsAuthenticated(true);
        setEmail(userEmail);
        fetchTasks();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setIsAuthenticated(false);
        setEmail('');
        setTasks([]);
    };

    return (
        <Router>
            <div className="flex flex-col items-center relative">
                <VantaBackground />
                <Header
                    isAuthenticated={isAuthenticated}
                    email={email}
                    onLogout={handleLogout}
                />
                <Routes>
                    <Route
                        path="/login"
                        element={
                            !isAuthenticated ? (
                                <Login onLogin={handleLogin} />
                            ) : (
                                <Navigate to="/tasks" replace />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            !isAuthenticated ? (
                                <Register />
                            ) : (
                                <Navigate to="/tasks" replace />
                            )
                        }
                    />
                    <Route
                        path="/tasks"
                        element={
                            isAuthenticated ? (
                                <TaskPage
                                    tasks={tasks}
                                    addTask={addTask}
                                    toggleTask={toggleTask}
                                    deleteTask={deleteTask}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/tasks" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;