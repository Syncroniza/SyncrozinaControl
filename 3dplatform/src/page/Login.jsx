import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import syncLogo from "/Syncroniza_transparente.png"

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Validation check
        if (username === 'UsuarioPedroTorres' && password === 'A1s2d3f4g5h6') {
            navigate('/home'); // Redirect to /home if validation passes
        } else {
            setError('Usuario y/o contraseña incorrectos');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <img
                    src={syncLogo} // Replace with your logo URL
                    alt="Logo"
                    className="w-20 mx-auto mb-4"
                />
                <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">
                    Bienvenido a Syncroniza
                </h2>
                <form onSubmit={handleLogin} className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Username"
                        className="mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mb-3">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;