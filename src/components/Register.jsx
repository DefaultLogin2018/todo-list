import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Registration failed');
            }
            await response.json();
            onRegister();
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-effect rounded-xl p-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Регистрация</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Зарегистрировать
                    </button>
                    {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                </form>
                <p className="text-center mt-4">
                    <Link to="/login" className="text-white-400 hover:text-white-300 transition duration-300">
                        Авторизация
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;