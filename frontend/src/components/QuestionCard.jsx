import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';

function QuestionCard({ question, index, isExpanded, onClick }) {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        if (!question.unlocked) {
            const updateTimer = () => {
                const now = new Date();
                const releaseDate = new Date(question.releaseTime);
                const diff = releaseDate - now;

                if (diff <= 0) {
                    setTimeRemaining('Available now!');
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                if (days > 0) {
                    setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
                } else if (hours > 0) {
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
                } else {
                    setTimeRemaining(`${minutes}m ${seconds}s`);
                }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [question]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStarterCode = () => {
        return `public class Solution {
    // Solve: ${question.title}
    
    // TODO: Implement your solution here
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Test your solution
        System.out.println("Testing ${question.title}...");
    }
}`;
    };

    return (
        <div
            className={`card transition-all duration-300 fade-in ${isExpanded ? 'ring-2 ring-indigo-500' : ''
                }`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Header - Clickable */}
            <div
                className="flex items-start justify-between gap-4 cursor-pointer"
                onClick={onClick}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-indigo-400">#{index + 1}</span>
                        <h3 className="text-xl font-semibold text-white">{question.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                        {question.unlocked ? (
                            <span className="badge-unlocked">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                Unlocked
                            </span>
                        ) : (
                            <span className="badge-locked">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Locked
                            </span>
                        )}
                        <span className="text-gray-500">
                            Release: {formatDate(question.releaseTime)}
                        </span>
                        {!question.unlocked && timeRemaining && (
                            <span className="text-amber-400 font-medium">
                                ⏱ {timeRemaining}
                            </span>
                        )}
                    </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-6">
                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                            Problem Description
                        </h4>
                        <div className="bg-dark-200 rounded-xl p-4 text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {question.description}
                        </div>
                    </div>

                    {/* Code Editor Toggle */}
                    <div className="flex gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEditor(!showEditor);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${showEditor
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            {showEditor ? 'Hide Editor' : 'Open Java Editor'}
                        </button>
                    </div>

                    {/* Code Editor */}
                    {showEditor && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <CodeEditor
                                initialCode={getStarterCode()}
                                questionTitle={question.title}
                            />
                        </div>
                    )}

                    {/* Solution (if unlocked) */}
                    {question.unlocked && question.solution ? (
                        <>
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                                    Solution
                                </h4>
                                <pre className="bg-dark-300 rounded-xl p-4 text-emerald-300 overflow-x-auto font-mono text-sm">
                                    <code>{question.solution}</code>
                                </pre>
                            </div>

                            {question.explanation && (
                                <div>
                                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">
                                        Explanation
                                    </h4>
                                    <div className="bg-dark-200 rounded-xl p-4 text-gray-300 whitespace-pre-wrap">
                                        {question.explanation}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-dark-300/50 rounded-xl p-8 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-gray-400 font-medium">Solution will be available after</p>
                            <p className="text-xl font-bold text-indigo-400 mt-1">{formatDate(question.releaseTime)}</p>
                            {timeRemaining && (
                                <p className="text-amber-400 mt-2">⏱ {timeRemaining} remaining</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default QuestionCard;
