import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import QuestionsList from './components/QuestionsList';
import ProblemPage from './components/ProblemPage';
import Navbar from './components/Navbar';
import { checkAuth } from './services/api';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // First check localStorage for persistent login
                const savedUser = localStorage.getItem('adminUser');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    // Check if login is still valid (within 24 hours)
                    const loginTime = userData.loginTime || 0;
                    const isValid = Date.now() - loginTime < 24 * 60 * 60 * 1000;
                    if (isValid) {
                        setUser({ username: userData.username, role: userData.role });
                        setLoading(false);
                        return;
                    } else {
                        localStorage.removeItem('adminUser');
                    }
                }

                // Fall back to server-side auth check
                const response = await checkAuth();
                if (response.success) {
                    setUser({ username: response.username, role: response.role });
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
            setLoading(false);
        };
        verifyAuth();
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        // Clear all auth data
        localStorage.removeItem('adminUser');
        localStorage.removeItem('solvedQuestions');
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen">
                <Navbar user={user} onLogout={handleLogout} />
                <main className="pt-16">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/questions" element={<QuestionsList />} />
                        <Route path="/problem/:id" element={<ProblemPage />} />
                        <Route
                            path="/login"
                            element={
                                user ? <Navigate to="/admin" replace /> : <Login onLogin={handleLogin} />
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" replace />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
