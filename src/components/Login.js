import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css'; 

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:1337/api/auth/local', {
                identifier,
                password,
            });
            setUser(response.data.user);
            localStorage.setItem('token', response.data.jwt);
            navigate('/chat');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <h1>Welcome Back!</h1>
                <p>Log in to continue chatting with friends.</p>
            </div>
            <div className="auth-right">
                <h2>LOGIN</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Enter Username or Email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
