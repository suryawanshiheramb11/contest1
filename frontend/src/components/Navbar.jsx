import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/api';

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            onLogout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-gray-800/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold gradient-text">CodeAssess</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className={`px-4 py-2 transition-colors duration-300 rounded-lg ${isActive('/')
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/questions"
                            className={`px-4 py-2 transition-colors duration-300 rounded-lg ${isActive('/questions')
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Questions
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 hidden sm:inline">
                                    Welcome, <span className="text-indigo-400 font-medium">{user.username}</span>
                                </span>
                                {user.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isActive('/admin')
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all"
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
