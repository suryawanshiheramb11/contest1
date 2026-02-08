import { useState, useEffect } from 'react';
import { getAdminQuestions, createQuestion, updateQuestion, deleteQuestion } from '../services/api';
import StarBackground from './StarBackground';

function AdminDashboard() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        solution: '',
        explanation: '',
        testCases: '',
        releaseTime: ''
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await getAdminQuestions();
            setQuestions(data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            solution: '',
            explanation: '',
            testCases: '',
            releaseTime: ''
        });
        setEditingQuestion(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (question) => {
        setEditingQuestion(question);
        setFormData({
            title: question.title,
            description: question.description,
            solution: question.solution || '',
            explanation: question.explanation || '',
            testCases: question.testCases || '',
            releaseTime: question.releaseTime?.slice(0, 16) || ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingQuestion) {
                await updateQuestion(editingQuestion.id, formData);
            } else {
                await createQuestion(formData);
            }
            fetchQuestions();
            closeModal();
        } catch (error) {
            console.error('Failed to save question:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(id);
                fetchQuestions();
            } catch (error) {
                console.error('Failed to delete question:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-400 mt-1">Manage coding assessment questions</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Question
                    </button>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((question, i) => (
                        <div key={question.id} className="bg-dark-300/90 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                            {/* Question Header */}
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div
                                    onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                                    className="flex items-center gap-4 cursor-pointer flex-1"
                                >
                                    <span className="text-xl font-bold text-indigo-400">#{i + 1}</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            Release: {formatDate(question.releaseTime)}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons - Always Visible */}
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${question.unlocked
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                        {question.unlocked ? 'Unlocked' : 'Locked'}
                                    </span>

                                    {/* Edit Button - More Visible */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEditModal(question); }}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-indigo-500/30"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(question.id); }}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>

                                    {/* Expand Toggle */}
                                    <button
                                        onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                                        className="p-2 hover:bg-dark-200 rounded-lg transition-colors"
                                    >
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedQuestion === question.id ? 'rotate-180' : ''}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedQuestion === question.id && (
                                <div className="px-6 py-4 border-t border-gray-700 space-y-6">
                                    {/* Description Preview */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-indigo-400 uppercase mb-2">Description Preview</h4>
                                        <div className="bg-dark-400 rounded-lg p-4 max-h-48 overflow-auto">
                                            <div
                                                className="problem-description"
                                                dangerouslySetInnerHTML={{ __html: question.description?.slice(0, 1000) + '...' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Solution - Code Editor Style */}
                                    {question.solution && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-emerald-400 uppercase mb-2">Solution (Function Only)</h4>
                                            <div className="bg-dark-400 rounded-lg border border-gray-700 overflow-hidden">
                                                <div className="px-4 py-2 bg-dark-300 border-b border-gray-700 flex items-center justify-between">
                                                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded">Java</span>
                                                    <span className="text-gray-500 text-xs">Solution.java</span>
                                                </div>
                                                <div className="flex">
                                                    {/* Line Numbers */}
                                                    <div className="py-4 px-3 bg-dark-400 text-gray-600 text-right font-mono text-sm select-none border-r border-gray-700" style={{ minWidth: '50px' }}>
                                                        {question.solution.split('\n').map((_, idx) => (
                                                            <div key={idx} className="leading-6">{idx + 1}</div>
                                                        ))}
                                                    </div>
                                                    {/* Code */}
                                                    <pre className="flex-1 py-4 px-4 text-[#f8c555] font-mono text-sm overflow-x-auto leading-6">
                                                        <code>{question.solution}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Test Cases */}
                                    {question.testCases && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-purple-400 uppercase mb-2">Test Cases (JSON)</h4>
                                            <div className="bg-dark-400 rounded-lg p-4">
                                                <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{question.testCases}</pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {questions.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">No questions yet. Click "Add Question" to create one.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-300 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-dark-400">
                            <h2 className="text-xl font-bold text-white">
                                {editingQuestion ? 'Edit Question' : 'Create New Question'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-dark-200 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Question Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g., The Ath Magic Number"
                                        className="w-full px-4 py-3 bg-dark-400 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (HTML) *</label>
                                    <div className="bg-dark-400 rounded-lg border border-gray-600 overflow-hidden">
                                        <div className="px-4 py-2 bg-dark-300 border-b border-gray-600">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">HTML</span>
                                        </div>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={8}
                                            placeholder="<h3>Problem Description</h3>&#10;<p>Use <sup>2</sup> for superscripts...</p>"
                                            className="w-full bg-dark-400 text-gray-300 font-mono text-sm p-4 border-0 focus:ring-0 resize-none"
                                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                        />
                                    </div>
                                </div>

                                {/* Solution */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Solution (Java Function Only)</label>
                                    <div className="bg-dark-400 rounded-lg border border-gray-600 overflow-hidden">
                                        <div className="px-4 py-2 bg-dark-300 border-b border-gray-600">
                                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded">Java</span>
                                        </div>
                                        <textarea
                                            value={formData.solution}
                                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                            rows={10}
                                            placeholder="public long solve(int A) {&#10;    // Your solution here&#10;}"
                                            className="w-full bg-dark-400 text-[#f8c555] font-mono text-sm p-4 border-0 focus:ring-0 resize-none leading-6"
                                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                        />
                                    </div>
                                </div>

                                {/* Test Cases */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Test Cases (JSON)</label>
                                    <div className="bg-dark-400 rounded-lg border border-gray-600 overflow-hidden">
                                        <div className="px-4 py-2 bg-dark-300 border-b border-gray-600">
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded">JSON</span>
                                        </div>
                                        <textarea
                                            value={formData.testCases}
                                            onChange={(e) => setFormData({ ...formData, testCases: e.target.value })}
                                            rows={6}
                                            placeholder='[&#10;  {"input": "3", "expected": "56"},&#10;  {"input": "10", "expected": "2450"}&#10;]'
                                            className="w-full bg-dark-400 text-purple-300 font-mono text-sm p-4 border-0 focus:ring-0 resize-none"
                                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                        />
                                    </div>
                                </div>

                                {/* Explanation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Explanation (HTML)</label>
                                    <textarea
                                        value={formData.explanation}
                                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                        rows={4}
                                        placeholder="<p>Explain the approach...</p>"
                                        className="w-full px-4 py-3 bg-dark-400 border border-gray-600 rounded-lg text-gray-300 font-mono text-sm"
                                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                    />
                                </div>

                                {/* Release Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Release Time *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.releaseTime}
                                        onChange={(e) => setFormData({ ...formData, releaseTime: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-dark-400 border border-gray-600 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Modal Footer - Fixed at bottom */}
                        <div className="px-6 py-4 border-t border-gray-700 bg-dark-400 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all"
                            >
                                {editingQuestion ? 'Save Changes' : 'Create Question'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
