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
        <div className="relative min-h-[calc(100vh-64px)]">
            <StarBackground />

            <div className="relative z-10">
                {/* Header Banner */}
                <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-3">
                    <div className="container mx-auto flex items-center gap-2 text-amber-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>This is running in Practice Mode. No score will be awarded for submissions in this mode.</span>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {/* Title Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">All Questions</h1>
                            <p className="text-gray-400">
                                {questions.filter(q => isSolved(q.id)).length} / {questions.length} Completed
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-gray-500">* Mandatory sections</span>
                        </div>
                    </div>

                    {/* Section Card */}
                    <div className="bg-dark-300/90 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                        {/* Section Header */}
                        <div className="px-6 py-4 border-b border-gray-700 bg-dark-400/80">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">SECTION 1 *</span>
                                    <h2 className="text-lg font-semibold text-white">Coding Problems</h2>
                                    <span className="text-sm text-indigo-400">{questions.length} questions</span>
                                </div>
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="px-6 py-3 border-b border-gray-700 bg-dark-400/50 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                            <div className="col-span-1">#</div>
                            <div className="col-span-5">Question</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Action</div>
                        </div>

                        {/* Questions List */}
                        <div className="divide-y divide-gray-700">
                            {questions.map((question, i) => (
                                <div
                                    key={question.id}
                                    className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-dark-300/50 transition-colors"
                                >
                                    {/* Number */}
                                    <div className="col-span-1 flex items-center gap-2">
                                        <span className="text-lg font-medium text-gray-400">{i + 1}</span>
                                        {isSolved(question.id) && (
                                            <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>

                                    {/* Question Title */}
                                    <div className="col-span-5">
                                        <h3 className="text-white font-medium">{question.title}</h3>
                                    </div>

                                    {/* Type */}
                                    <div className="col-span-2">
                                        <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                            Code
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2">
                                        {isSolved(question.id) ? (
                                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Answered Successfully
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Not attempted</span>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-2">
                                        <button
                                            onClick={() => handleSolve(question)}
                                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Solve now
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
