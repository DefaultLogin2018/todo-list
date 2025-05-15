import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import TaskPage from './components/TaskPage.jsx';
import useTasks from './hooks/useTasks.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [email, setEmail] = useState('');
    const { tasks, addTask, toggleTask, deleteTask, fetchTasks } = useTasks(isAuthenticated);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        if (token) {
            setEmail('zeleboba@example.com'); // Замени на реальный email
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setEmail('zeleboba@example.com'); // Замени на реальный email
        fetchTasks();
    };

    const handleRegister = () => {
        setIsAuthenticated(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setEmail('');
        fetchTasks();
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
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
                                <Register onRegister={handleRegister} />
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
                                    onLogout={handleLogout}
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