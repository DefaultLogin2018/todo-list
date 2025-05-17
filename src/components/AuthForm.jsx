import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthInput } from './ui/auth-input';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';

function AuthForm({ title, buttonText, apiUrl, onSuccess, linkTo, linkText }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || `${title} failed`);
            }
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
            }
            await new Promise((resolve) => setTimeout(resolve, 8000));
            onSuccess(data.email || '');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                className="auth-card"
                initial={{ width: '18rem', height: '350px' }}
                animate={{
                    width: isLoading ? '290px' : '18rem',
                    height: isLoading ? '50px' : '450px' // Изменено с 90px на 50px
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                <Card className="w-full h-full bg-transparent border-none shadow-none rounded-2xl flex flex-col">
                    <CardContent className="p-6 flex flex-col items-center h-full bg-transparent">
                        {!isLoading ? (
                            <>
                                <h2 className="text-3xl text-center login-title">{title}</h2>
                                <div className="flex-1 flex flex-col justify-center items-center w-full">
                                    <form onSubmit={handleSubmit} className="space-y-1.5 w-full">
                                        <div className="input-wrapper flex justify-center input-login">
                                            <AuthInput
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Почта"
                                                className="w-[80%]"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="input-wrapper flex justify-center">
                                            <AuthInput
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Пароль"
                                                className="w-[80%]"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="gradient-button-wrapper flex justify-center mt-10 button-log">
                                            <button
                                                type="submit"
                                                className="gradient-button w-[60%]"
                                                disabled={isLoading}
                                            >
                                                {buttonText}
                                                <svg
                                                    aria-hidden="true"
                                                    viewBox="0 0 10 10"
                                                    height="10"
                                                    width="10"
                                                    fill="none"
                                                >
                                                    <path d="M0 5h7" className="arrow-line" />
                                                    <path d="M1 1l4 4-4 4" className="arrow-head" />
                                                </svg>
                                            </button>
                                        </div>
                                        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                                    </form>
                                </div>
                                <p className="text-center mb-4">
                                    <Link to={linkTo} className="register-link text-sm text-gray-400">
                                        {linkText}
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="card">
                                    <div className="loader">
                                        <p>загрузка</p>
                                        <div className="words">
                                            <span className="word">кнопочек</span>
                                            <span className="word">записей</span>
                                            <span className="word">свечей</span>
                                            <span className="word">кобольдов</span>
                                            <span className="word">информации</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default AuthForm;