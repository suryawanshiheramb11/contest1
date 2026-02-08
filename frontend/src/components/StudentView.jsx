import { useState, useEffect } from 'react';
import { getQuestions } from '../services/api';
import QuestionCard from './QuestionCard';

function StudentView() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions();
            setQuestions(data);
        } catch (error) {
            setError('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12 fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="gradient-text">Coding Challenges</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Master algorithms through practice. Write your Java solutions and unlock the answers at scheduled times!
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="card text-center fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="text-3xl font-bold text-indigo-400 mb-1">{questions.length}</div>
                    <div className="text-gray-400">Total Questions</div>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                        {questions.filter(q => q.unlocked).length}
                    </div>
                    <div className="text-gray-400">Unlocked</div>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="text-3xl font-bold text-amber-400 mb-1">
                        {questions.filter(q => !q.unlocked).length}
                    </div>
                    <div className="text-gray-400">Locked</div>
                </div>
            </div>

            {/* Java Badge */}
            <div className="flex justify-center mb-6 fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Java Code Editor Available for Each Question
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 mb-6">
                    {error}
                </div>
            )}

            {/* Questions Grid */}
            <div className="space-y-4">
                {questions.map((question, index) => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        isExpanded={selectedQuestion === question.id}
                        onClick={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
                    />
                ))}
            </div>

            {questions.length === 0 && !loading && (
                <div className="card text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Questions Yet</h3>
                    <p className="text-gray-500">Check back later for new coding challenges!</p>
                </div>
            )}
        </div>
    );
}

export default StudentView;
