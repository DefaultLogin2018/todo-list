import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';

function Header({ isAuthenticated, email, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <header className="bg-transparent py-4 px-6 mx-auto w-[1000px] max-w-full">
            <div className="flex justify-between items-center w-full">
                <Link to="/" className="text-3xl font-bold text-black">
                    To-Do List
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-white font-medium">{email}</span>
                            <Button
                                onClick={handleLogout}
                                variant="gradient"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            {location.pathname === '/register' ? (
                                <Link to="/login">
                                    <Button variant="gradient">
                                        Авторизация
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/register">
                                    <Button variant="gradient">
                                        Регистрация
                                    </Button>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;