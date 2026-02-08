import { Link } from 'react-router-dom';
import StarBackground from './StarBackground';

function LandingPage() {
    return (
        <div className="min-h-screen relative">
            <StarBackground />

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4">
                <div className="text-center max-w-4xl mx-auto fade-in">
                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-bold mb-6">
                        <span className="gradient-text">CodeAssess</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-4">
                        Master Algorithms. Ace Interviews.
                    </p>

                    <p className="text-base text-gray-500 max-w-xl mx-auto mb-12">
                        Practice coding challenges with time-released solutions. Write and test your Java code
                        in our built-in editor.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <Link
                            to="/questions"
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Practicing
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all border border-gray-700 hover:border-gray-500 flex items-center justify-center gap-2"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-dark-300/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Time-Released Solutions</h3>
                        <p className="text-gray-500 text-sm">
                            Solutions unlock after scheduled time. Practice first, then learn.
                        </p>
                    </div>

                    <div className="bg-dark-300/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Java Code Editor</h3>
                        <p className="text-gray-500 text-sm">
                            Built-in editor with syntax highlighting and AI verification.
                        </p>
                    </div>

                    <div className="bg-dark-300/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Curated Problems</h3>
                        <p className="text-gray-500 text-sm">
                            Selected algorithm problems for interview preparation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 text-center py-6 text-gray-600 text-sm">
                <p>Built for Coding Assessment • Java Only</p>
            </footer>
        </div>
    );
}

export default LandingPage;
