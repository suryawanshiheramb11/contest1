import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions } from '../services/api';
import { validateCodeWithGemini } from '../services/gemini';
import StarBackground from './StarBackground';
import FullscreenEnforcer from './FullscreenEnforcer';
import Editor from '@monaco-editor/react';

function ProblemPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [enableFullscreen, setEnableFullscreen] = useState(true);
    const [solvedQuestions, setSolvedQuestions] = useState(() => {
        const saved = localStorage.getItem('solvedQuestions');
        return saved ? JSON.parse(saved) : [];
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            const question = questions.find(q => q.id === parseInt(id)) || questions[0];
            setCurrentQuestion(question);
            // Use starter code from API, or fallback
            setCode(question?.starterCode || getStarterCode(question?.title || ''));
            setOutput('');
            setValidationResult(null);
        }
    }, [id, questions]);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions();
            setQuestions(data);
        } catch (err) {
            console.error('Failed to load questions:', err);
            setError('Failed to load questions. Please ensure the backend server is running.');
        }
    };

    const getStarterCode = (title) => {
        return `public class Solution {
    // Solve: ${title}
    public void solve() {
        // Write your code here
    }
}`;
    };

    const handleQuestionSelect = (question) => {
        navigate(`/problem/${question.id}`);
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput('🚀 Running text cases with AI...');
        setValidationResult(null);

        try {
            const result = await validateCodeWithGemini(
                code,
                currentQuestion?.title || '',
                currentQuestion?.description || '',
                currentQuestion?.solution || ''
            );

            if (result.isCorrect) {
                setOutput(
                    `✅ Test Run Passed!\n\n` +
                    'Sample Test Case Results:\n' +
                    (result.testCaseResults?.map((tc, i) =>
                        `  ${tc.passed ? '✓' : '✗'} Test ${i + 1}: Passed`
                    ).join('\n') || 'All sample cases passed.') +
                    '\n\nReady to Submit?'
                );
            } else {
                let failureMsg = `⚠️ Test Run Failed/Issues Found.\n\n`;

                if (result.compilationError) {
                    failureMsg += `❌ COMPILATION ERROR:\n${result.compilationError}\n\n`;
                }

                failureMsg += `Feedback: ${result.feedback}\n\n` +
                    'Test Case Results:\n' +
                    (result.testCaseResults?.map((tc, i) =>
                        `  ${tc.passed ? '✓' : '✗'} Test ${i + 1}: ${tc.passed ? 'Passed' : 'Failed'}`
                    ).join('\n') || 'Check your logic.');

                setOutput(failureMsg);
            }
        } catch (error) {
            setOutput(`❌ Error validating code: ${error.message}`);
        }
        setIsRunning(false);
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setOutput('🔍 Validating your solution with AI...');
        setValidationResult(null);

        try {
            const result = await validateCodeWithGemini(
                code,
                currentQuestion?.title || '',
                currentQuestion?.description || '',
                currentQuestion?.solution || ''
            );

            setValidationResult(result);

            if (result.isCorrect && result.score >= 70) {
                const newSolved = [...solvedQuestions, currentQuestion?.id];
                // Avoid duplicates
                if (!solvedQuestions.includes(currentQuestion?.id)) {
                    setSolvedQuestions(newSolved);
                    localStorage.setItem('solvedQuestions', JSON.stringify(newSolved));
                }

                setOutput(
                    `✅ Solution Accepted! Score: ${result.score}/100\n\n` +
                    `${result.feedback}\n\n` +
                    'Test Case Results:\n' +
                    (result.testCaseResults?.map((tc, i) =>
                        `  ${tc.passed ? '✓' : '✗'} Test ${i + 1}: ${tc.passed ? 'Passed' : 'Failed'}`
                    ).join('\n') || 'All test cases passed!') +
                    '\n\n🎉 Great job!'
                );
            } else {
                setOutput(
                    `❌ Solution Needs Improvement. Score: ${result.score}/100\n\n` +
                    `Feedback: ${result.feedback}\n\n` +
                    (result.suggestions?.length > 0
                        ? 'Suggestions:\n' + result.suggestions.map(s => `  • ${s}`).join('\n')
                        : '') +
                    '\n\nPlease review your code and try again.'
                );
            }
        } catch (error) {
            setOutput(`❌ Error validating code: ${error.message}`);
        }

        setIsRunning(false);
    };

    const handleReset = () => {
        setCode(currentQuestion?.starterCode || getStarterCode(currentQuestion?.title || ''));
        setOutput('');
        setValidationResult(null);
    };

    const isSolved = (questionId) => solvedQuestions.includes(questionId);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white/10 rounded hover:bg-white/20 text-white">Retry</button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <FullscreenEnforcer enabled={enableFullscreen}>
            <div className="relative min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans">
                {/* Simplified Background - No Stars for cleaner focus, or very subtle */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />

                <div className="relative z-10 flex h-screen pt-14">
                    {/* Left Sidebar - Question Numbers */}
                    <div className="w-16 bg-black/50 backdrop-blur-md border-r border-white/5 flex flex-col items-center py-6 overflow-y-auto hidden md:flex">
                        {questions.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => handleQuestionSelect(q)}
                                className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center text-xs font-medium transition-all relative group ${currentQuestion?.id === q.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-110'
                                    : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                                    }`}
                            >
                                {i + 1}
                                {isSolved(q.id) && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Content - Split View */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Left Panel - Problem Description (35%) */}
                        <div className="w-full md:w-[35%] flex flex-col border-r border-white/5 bg-black/30 backdrop-blur-sm">
                            {/* Problem Header */}
                            <div className="px-8 py-6 border-b border-white/5">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-mono text-indigo-400">
                                            Problem {questions.findIndex(q => q.id === currentQuestion.id) + 1}
                                        </span>
                                        <div className="flex gap-2">
                                            {isSolved(currentQuestion.id) && (
                                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                                                    Solved
                                                </span>
                                            )}
                                            {!currentQuestion.unlocked && (
                                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/20">
                                                    Locked
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
                                        {currentQuestion.title}
                                    </h1>
                                </div>
                            </div>

                            {/* Problem Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                                {/* Problem Description */}
                                <div
                                    className="problem-description text-gray-300 leading-relaxed text-lg" // Increased text size via class and utility
                                    dangerouslySetInnerHTML={{ __html: currentQuestion.description }}
                                />

                                {/* Solution & Explanation */}
                                {currentQuestion.unlocked && isSolved(currentQuestion.id) && (
                                    <div className="mt-12 space-y-8">
                                        {currentQuestion.solution && (
                                            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                                <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-xs font-mono text-gray-400 uppercase tracking-wider">
                                                    Solution
                                                </div>
                                                <pre className="p-4 overflow-x-auto text-sm text-emerald-300 font-mono bg-black/50">
                                                    <code>{currentQuestion.solution}</code>
                                                </pre>
                                            </div>
                                        )}

                                        {currentQuestion.explanation && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                                                    Explanation
                                                </h4>
                                                <div
                                                    className="problem-description text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Code Editor (65%) */}
                        <div className="w-full md:w-[65%] flex flex-col bg-[#050505]">
                            {/* Editor Header */}
                            <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        <span className="text-sm font-medium text-gray-300">Java</span>
                                    </div>
                                    <div className="h-4 w-px bg-white/10" />
                                    <span className="text-xs text-gray-500 font-mono">Solution.java</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleReset}
                                        className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                        title="Reset Code"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>

                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-emerald-500 text-xs font-semibold tracking-wide">AI ENABLED</span>
                                    </div>
                                </div>
                            </div>

                            {/* Code Editor Area */}
                            <div className="flex-1 overflow-hidden relative group bg-[#1e1e1e]">
                                <Editor
                                    height="100%"
                                    defaultLanguage="java"
                                    value={code}
                                    theme="vs-dark"
                                    onChange={(value) => setCode(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        roundedSelection: false,
                                        scrollBeyondLastLine: false,
                                        readOnly: false,
                                        automaticLayout: true,
                                        padding: { top: 16, bottom: 16 },
                                        fontFamily: '"JetBrains Mono", Menlo, Monaco, "Courier New", monospace',
                                    }}
                                />
                            </div>

                            {/* Bottom Panel - Test & Submit */}
                            <div className="border-t border-white/5 bg-white/[0.02]">
                                {/* Output / Console */}
                                <div className={`transition-all duration-300 ease-in-out ${output ? 'h-48' : 'h-12'} overflow-hidden flex flex-col`}>

                                    {/* Console Header */}
                                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5" onClick={() => setOutput(output ? '' : ' ')}>
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                                            Console Output
                                        </span>
                                        {validationResult && (
                                            <span className={`text-xs font-bold ${validationResult.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                Score: {validationResult.score}/100
                                            </span>
                                        )}

                                        {/* Toggle chevron if needed, or just rely on height */}
                                    </div>

                                    {/* Console Body */}
                                    <div className="flex-1 overflow-auto p-6 bg-[#0a0a0a] custom-scrollbar">
                                        {output ? (
                                            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{output}</pre>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-700 text-sm italic">
                                                Ready to execute...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-t border-white/5">
                                    <button
                                        onClick={() => setEnableFullscreen(!enableFullscreen)}
                                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-xs font-medium flex items-center gap-2 rounded-lg hover:bg-white/5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                        {enableFullscreen ? 'Exit Exam Mode' : 'Enter Exam Mode'}
                                    </button>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleRun}
                                            disabled={isRunning}
                                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-white/5"
                                        >

                                            {isRunning ? 'Running...' : 'Test'}
                                        </button>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={isRunning}
                                            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                                        >
                                            {isRunning ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            Submit Solution
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FullscreenEnforcer>
    );
}

export default ProblemPage;
