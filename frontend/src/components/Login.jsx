import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import StarBackground from './StarBackground';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password);
            if (response.success) {
                // Store user in localStorage for persistent login
                localStorage.setItem('adminUser', JSON.stringify({
                    username: response.username,
                    role: response.role,
                    loginTime: Date.now()
                }));
                onLogin({ username: response.username, role: response.role });
                navigate('/admin');
            } else {
                setError(response.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center pt-16">
            <StarBackground />

            <div className="relative z-10 w-full max-w-sm mx-auto px-4">
                {/* Simple Login Card */}
                <div className="bg-dark-300/90 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white mb-1">Admin Login</h1>
                        <p className="text-gray-500 text-sm">Enter your credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 bg-dark-400 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                placeholder="admin"
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-dark-400 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Hint */}
                    <p className="mt-5 text-center text-gray-600 text-xs">
                        Default: <span className="text-indigo-400">admin</span> / <span className="text-indigo-400">password</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
