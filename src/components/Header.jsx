import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Button } from 'flowbite-react';

function Header({ isAuthenticated, email, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <Navbar fluid rounded className="bg-transparent w-full py-4 px-6">
            <div className="flex justify-between items-center w-full">
                <Navbar.Brand as={Link} to="/">
                    <span className="text-xl font-semibold text-white">To-Do List</span>
                </Navbar.Brand>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-white font-medium">{email}</span>
                            <Button
                                color="failure"
                                onClick={handleLogout}
                                size="sm"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            {location.pathname === '/register' ? (
                                <Link to="/login">
                                    <Button className="custom-green-button">
                                         Авторизация
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/register">
                                    <Button className="custom-purple-button">
                                        Регистрация
                                    </Button>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Navbar>
    );
}

export default Header;