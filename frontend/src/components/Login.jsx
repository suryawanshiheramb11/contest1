import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import StarBackground from './StarBackground';

function Login({ onLogin }) {
    const [loginType, setLoginType] = useState('admin'); // 'admin' or 'student'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdminSubmit = async (e) => {
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

    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple student login - just store student info and redirect to questions
        if (studentId.trim()) {
            localStorage.setItem('studentInfo', JSON.stringify({
                studentId: studentId,
                loginTime: Date.now()
            }));
            setLoading(false);
            navigate('/questions');
        } else {
            setError('Please enter your Student ID');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] relative flex items-center justify-center py-8 bg-black">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black pointer-events-none" />

            <div className="relative z-10 w-full max-w-[420px] mx-auto px-4">
                {/* Login Card */}
                <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-500 text-sm">Sign in to continue to CodeAssess</p>
                    </div>

                    {/* Tab Header - Minimal */}
                    <div className="flex border-b border-white/10 mb-8">
                        <button
                            onClick={() => { setLoginType('admin'); setError(''); }}
                            className={`flex-1 py-3 text-sm font-medium transition-all relative ${loginType === 'admin'
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            Admin
                            {loginType === 'admin' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>}
                        </button>
                        <button
                            onClick={() => { setLoginType('student'); setError(''); }}
                            className={`flex-1 py-3 text-sm font-medium transition-all relative ${loginType === 'student'
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            Student
                            {loginType === 'student' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>}
                        </button>
                    </div>

                    {/* Form Content */}
                    <div>
                        {loginType === 'admin' ? (
                            /* Admin Login Form */
                            <form onSubmit={handleAdminSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm outline-none"
                                        placeholder="Enter your username"
                                        required
                                        autoComplete="username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm outline-none"
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm mt-4"
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>
                        ) : (
                            /* Student Login Form */
                            <form onSubmit={handleStudentSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm outline-none"
                                        placeholder="e.g. 210005"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm mt-4"
                                >
                                    {loading ? 'Starting...' : 'Start Assessment'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-xs">
                        &copy; 2026 CodeAssess Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
