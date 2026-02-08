import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions } from '../services/api';
import { validateCodeWithGemini } from '../services/gemini';
import StarBackground from './StarBackground';
import FullscreenEnforcer from './FullscreenEnforcer';

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

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            const question = questions.find(q => q.id === parseInt(id)) || questions[0];
            setCurrentQuestion(question);
            setCode(getStarterCode(question?.title || ''));
            setOutput('');
            setValidationResult(null);
        }
    }, [id, questions]);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions();
            setQuestions(data);
        } catch (error) {
            console.error('Failed to load questions:', error);
        }
    };

    const getStarterCode = (title) => {
        return `public class Solution {
    // Solve: ${title}
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Test your solution
        System.out.println("Testing...");
    }
}`;
    };

    const handleQuestionSelect = (question) => {
        navigate(`/problem/${question.id}`);
    };

    const handleRun = () => {
        setIsRunning(true);
        setOutput('Compiling and running...');
        setValidationResult(null);

        setTimeout(() => {
            setOutput(
                '> javac Solution.java\n' +
                '> java Solution\n\n' +
                'Testing...\n\n' +
                '---\n' +
                'Note: Use your local Java environment for actual execution.\n' +
                'Copy code and run: javac Solution.java && java Solution'
            );
            setIsRunning(false);
        }, 1000);
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setOutput('🔍 Validating your solution with AI...');
        setValidationResult(null);

        try {
            // Call Gemini API to validate code
            const result = await validateCodeWithGemini(
                code,
                currentQuestion?.title || '',
                currentQuestion?.description || '',
                currentQuestion?.solution || ''
            );

            setValidationResult(result);

            if (result.isCorrect && result.score >= 70) {
                // Mark as solved
                const newSolved = [...solvedQuestions, currentQuestion?.id];
                setSolvedQuestions(newSolved);
                localStorage.setItem('solvedQuestions', JSON.stringify(newSolved));

                setOutput(
                    `✅ Solution Accepted! Score: ${result.score}/100\n\n` +
                    `${result.feedback}\n\n` +
                    'Test Case Results:\n' +
                    (result.testCaseResults?.map((tc, i) =>
                        `  ${tc.passed ? '✓' : '✗'} Test ${i + 1}: ${tc.input} → ${tc.passed ? 'Passed' : 'Failed'}`
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
        setCode(getStarterCode(currentQuestion?.title || ''));
        setOutput('');
        setValidationResult(null);
    };

    const isSolved = (questionId) => solvedQuestions.includes(questionId);

    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <FullscreenEnforcer enabled={enableFullscreen}>
            <div className="relative">
                <StarBackground />

                <div className="relative z-10 flex h-[calc(100vh-64px)]">
                    {/* Left Sidebar - Question Numbers */}
                    <div className="w-16 bg-dark-400 border-r border-gray-700 flex flex-col items-center py-4 overflow-y-auto">
                        {questions.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => handleQuestionSelect(q)}
                                className={`w-10 h-10 rounded-lg mb-2 flex items-center justify-center text-sm font-medium transition-all relative ${currentQuestion?.id === q.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-white'
                                    }`}
                            >
                                Q{i + 1}
                                {isSolved(q.id) && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Content - Split View */}
                    <div className="flex-1 flex">
                        {/* Left Panel - Problem Description (40%) */}
                        <div className="w-[40%] border-r border-gray-700 flex flex-col overflow-hidden bg-dark-200/50">
                            {/* Problem Header */}
                            <div className="px-6 py-4 border-b border-gray-700 bg-dark-300">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-2xl font-bold text-indigo-400">
                                        {questions.findIndex(q => q.id === currentQuestion.id) + 1}.
                                    </span>
                                    <h1 className="text-xl font-bold text-white">{currentQuestion.title}</h1>
                                    {isSolved(currentQuestion.id) && (
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Solved
                                        </span>
                                    )}
                                    {!currentQuestion.unlocked && (
                                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                                            🔒 Locked
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Problem Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Problem Description - Rendered as HTML */}
                                <div
                                    className="problem-description"
                                    dangerouslySetInnerHTML={{ __html: currentQuestion.description }}
                                />

                                {/* Solution (if unlocked) */}
                                {currentQuestion.unlocked && currentQuestion.solution && (
                                    <div className="mt-8">
                                        <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                                            Solution
                                        </h4>
                                        <pre className="bg-dark-400 rounded-lg p-4 text-emerald-300 overflow-x-auto font-mono text-sm border border-gray-700">
                                            <code>{currentQuestion.solution}</code>
                                        </pre>
                                    </div>
                                )}

                                {currentQuestion.unlocked && currentQuestion.explanation && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
                                            Explanation
                                        </h4>
                                        <div
                                            className="problem-description"
                                            dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Code Editor (60%) */}
                        <div className="w-[60%] flex flex-col bg-dark-200">
                            {/* Editor Header */}
                            <div className="px-4 py-3 border-b border-gray-700 bg-dark-300 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm font-medium rounded-lg">
                                        Java 8
                                    </span>
                                    <span className="text-gray-500 text-sm">Solution.java</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleReset}
                                        className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reset Code
                                    </button>

                                    {/* AI Verified Badge - More Visible */}
                                    <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 rounded-lg flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-emerald-400 font-semibold text-sm">AI Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Code Editor Area */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <div className="flex flex-1 overflow-auto">
                                    {/* Line Numbers */}
                                    <div className="py-4 px-3 bg-dark-400 text-gray-600 text-right font-mono text-sm select-none border-r border-gray-700" style={{ minWidth: '50px' }}>
                                        {code.split('\n').map((_, i) => (
                                            <div key={i} className="leading-6">{i + 1}</div>
                                        ))}
                                    </div>

                                    {/* Code Textarea */}
                                    <textarea
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="flex-1 py-4 px-4 bg-dark-200 text-[#f8c555] font-mono text-sm resize-none focus:outline-none leading-6"
                                        spellCheck={false}
                                        style={{
                                            caretColor: 'white',
                                            fontFamily: 'JetBrains Mono, Menlo, Monaco, monospace'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Test Cases Section */}
                            <div className="border-t border-gray-700">
                                <div className="px-4 py-2 bg-dark-300 border-b border-gray-700 flex items-center justify-between">
                                    <span className="text-sm font-medium text-white">Test Cases</span>
                                    {validationResult && (
                                        <span className={`text-sm font-medium ${validationResult.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                            Score: {validationResult.score}/100
                                        </span>
                                    )}
                                </div>
                                <div className="h-36 overflow-auto p-4 bg-dark-400">
                                    {output ? (
                                        <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{output}</pre>
                                    ) : (
                                        <span className="text-gray-500 text-sm">Output goes here... Test/Submit your solution</span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="px-4 py-3 bg-dark-300 flex justify-between items-center">
                                    {/* Fullscreen Toggle */}
                                    <button
                                        onClick={() => setEnableFullscreen(!enableFullscreen)}
                                        className="px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                        {enableFullscreen ? 'Exit Exam Mode' : 'Enter Exam Mode'}
                                    </button>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleRun}
                                            disabled={isRunning}
                                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            {isRunning ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Running...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    </svg>
                                                    Run
                                                </>
                                            )}
                                        </button>

                                        {/* AI Submit Button - More Visible */}
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isRunning}
                                            className="px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 border border-purple-400/30"
                                        >
                                            {isRunning ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    AI Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                    AI Submit & Verify
                                                </>
                                            )}
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
