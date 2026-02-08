import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions } from '../services/api';
import StarBackground from './StarBackground';

function QuestionsList() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [solvedQuestions, setSolvedQuestions] = useState(() => {
        const saved = localStorage.getItem('solvedQuestions');
        return saved ? JSON.parse(saved) : [];
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions();
            setQuestions(data);
        } catch (error) {
            console.error('Failed to load questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const isSolved = (questionId) => solvedQuestions.includes(questionId);

    const handleSolve = (question) => {
        navigate(`/problem/${question.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)] bg-black text-white selection:bg-indigo-500/30 font-sans">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black pointer-events-none" />
            <StarBackground />

            <div className="relative z-10">
                {/* Header Banner - Practice Mode */}
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 backdrop-blur-sm">
                    <div className="container mx-auto flex items-center justify-center gap-3 text-amber-400/90 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Practice Mode Active — Scores are not recorded.</span>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-12 max-w-6xl">
                    {/* Title Section */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Question Bank</h1>
                            <p className="text-gray-400 text-lg">
                                Master trusted algorithms one by one.
                            </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <div className="text-3xl font-bold text-white mb-1">
                                {questions.filter(q => isSolved(q.id)).length} <span className="text-gray-500 text-lg">/ {questions.length}</span>
                            </div>
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Completed</span>
                        </div>
                    </div>

                    {/* Section Card */}
                    <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl shadow-black/50">
                        {/* Section Header */}
                        <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Algorithms & Data Structures</h2>
                                    <p className="text-sm text-gray-500">Core interview problems</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-medium rounded-full border border-white/5">
                                SECTION 1
                            </span>
                        </div>

                        {/* Table Header */}
                        <div className="px-8 py-4 border-b border-white/5 bg-black/50 grid grid-cols-12 gap-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                            <div className="col-span-1">#</div>
                            <div className="col-span-6">Question</div>
                            <div className="col-span-2 text-center">Difficulty</div>
                            <div className="col-span-3 text-right">Action</div>
                        </div>

                        {/* Questions List */}
                        <div className="divide-y divide-white/5">
                            {questions.map((question, i) => (
                                <div
                                    key={question.id}
                                    onClick={() => handleSolve(question)} // Make entire row clickable
                                    className="px-8 py-5 grid grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                >
                                    {/* Number */}
                                    <div className="col-span-1 flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {isSolved(question.id) && (
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        )}
                                    </div>

                                    {/* Question Title */}
                                    <div className="col-span-6">
                                        <h3 className="text-base font-medium text-gray-200 group-hover:text-white transition-colors flex items-center gap-3">
                                            {question.title}
                                            {isSolved(question.id) && (
                                                <span className="text-emerald-500 text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    Solved
                                                </span>
                                            )}
                                        </h3>
                                    </div>

                                    {/* Difficulty / Type (Mocked as Medium for now) */}
                                    <div className="col-span-2 text-center">
                                        <span className="text-xs font-medium text-yellow-500/80 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                            Medium
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-3 text-right">
                                        <button
                                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all transform duration-200 ${isSolved(question.id)
                                                ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                : 'bg-white text-black hover:bg-indigo-50 group-hover:translate-x-1'
                                                }`}
                                        >
                                            {isSolved(question.id) ? 'Review' : 'Solve Challenge'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestionsList;
