import { useState } from 'react';

function CodeEditor({ initialCode = '', questionTitle = '' }) {
    const [code, setCode] = useState(initialCode || getDefaultJavaCode(questionTitle));
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    function getDefaultJavaCode(title) {
        return `public class Solution {
    // Write your solution here
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Test your solution
        System.out.println("Hello, Java!");
    }
}`;
    }

    const handleRun = async () => {
        setIsRunning(true);
        setOutput('Compiling and running...\n');

        // Simulate execution (in a real app, you'd send to a backend)
        setTimeout(() => {
            setOutput(
                '⚠️ Note: This is a client-side code editor.\n\n' +
                'To run Java code, you\'ll need to:\n' +
                '1. Copy the code to your local IDE\n' +
                '2. Compile with: javac Solution.java\n' +
                '3. Run with: java Solution\n\n' +
                '---\n' +
                'Your code has been saved. Use a local Java environment to test.'
            );
            setIsRunning(false);
        }, 1000);
    };

    const handleReset = () => {
        setCode(getDefaultJavaCode(questionTitle));
        setOutput('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setOutput('✓ Code copied to clipboard!');
    };

    return (
        <div className="space-y-4">
            {/* Editor Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Java
                    </div>
                    <span className="text-gray-500 text-sm">Solution.java</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                        title="Copy Code"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                        title="Reset Code"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                    </button>
                </div>
            </div>

            {/* Code Editor Area */}
            <div className="relative bg-dark-300 rounded-xl border border-gray-700 overflow-hidden">
                {/* Line Numbers + Code */}
                <div className="flex">
                    {/* Line Numbers */}
                    <div className="py-4 px-3 bg-dark-400 text-gray-600 text-right font-mono text-sm select-none border-r border-gray-700">
                        {code.split('\n').map((_, i) => (
                            <div key={i} className="leading-6">{i + 1}</div>
                        ))}
                    </div>

                    {/* Code Textarea */}
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 py-4 px-4 bg-transparent text-emerald-300 font-mono text-sm resize-none focus:outline-none leading-6"
                        rows={Math.max(15, code.split('\n').length)}
                        spellCheck={false}
                        placeholder="// Write your Java code here..."
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="btn-primary flex items-center gap-2"
                >
                    {isRunning ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Running...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Run Code
                        </>
                    )}
                </button>
            </div>

            {/* Output Console */}
            {output && (
                <div className="bg-dark-300 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-4 py-2 bg-dark-400 border-b border-gray-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-400 text-sm font-medium">Output</span>
                    </div>
                    <pre className="p-4 text-gray-300 font-mono text-sm whitespace-pre-wrap">
                        {output}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default CodeEditor;
