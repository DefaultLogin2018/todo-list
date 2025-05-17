import React from 'react';
import AuthForm from './AuthForm';

function Login({ onLogin }) {
    return (
        <AuthForm
            title="Авторизация"
            buttonText="Войти"
            apiUrl="http://localhost:5000/login"
            onSuccess={onLogin}
            linkTo="/register"
            linkText="Нужна регистрация?"
        />
    );
}

export default Login;