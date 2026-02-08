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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                            CA
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight group-hover:text-gray-200 transition-colors">
                            CodeAssess
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors duration-300 ${isActive('/')
                                ? 'text-white'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/questions"
                            className={`text-sm font-medium transition-colors duration-300 ${isActive('/questions')
                                ? 'text-white'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            Questions
                        </Link>

                        <div className="h-4 w-px bg-white/10 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-zinc-500 text-sm hidden sm:inline">
                                    <span className="text-zinc-300">{user?.username}</span>
                                </span>
                                {user.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-zinc-500 hover:text-white text-sm font-medium transition-colors"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
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
