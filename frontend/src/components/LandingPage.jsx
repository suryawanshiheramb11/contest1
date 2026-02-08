import { Link } from 'react-router-dom';
import StarBackground from './StarBackground';

function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-indigo-500/30">
            <StarBackground />

            {/* Navbar Placeholder for visual consistency if needed, or just padding */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                <div className="text-xl font-bold tracking-tighter">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        CA
                    </span>
                </div>
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Admin
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-5xl mx-auto fade-in">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span>v2.0 Now Live</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                            Master
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                            Algorithms
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        The premium platform for coding assessments.
                        <span className="hidden md:inline"> <br /></span>
                        Practice with time-released solutions in a beautiful environment.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
                        <Link
                            to="/questions"
                            className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
                        >
                            Start Practicing
                            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* Minimal Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 w-full fade-in" style={{ animationDelay: '0.2s' }}>
                    {[
                        { title: 'Time-Lock', desc: 'Solutions reveal only when you need them.' },
                        { title: 'Java Core', desc: 'Pure Java environment for serious developers.' },
                        { title: 'Curated', desc: 'Hand-picked problems for interview success.' }
                    ].map((feature, i) => (
                        <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500 hover:border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-medium text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Minimal */}
            <div className="absolute bottom-6 left-0 w-full text-center z-10">
                <p className="text-xs text-gray-600 font-mono tracking-widest uppercase">
                    Designed for Excellence
                </p>
            </div>
        </div>
    );
}

export default LandingPage;
