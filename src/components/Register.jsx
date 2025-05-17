import React from 'react';
import AuthForm from './AuthForm';

function Register() {
    return (
        <AuthForm
            title="Регистрация"
            buttonText="Зарегистрировать"
            apiUrl="http://localhost:5000/register"
            onSuccess={() => {}}
            linkTo="/login"
            linkText="Авторизация"
        />
    );
}

export default Register;