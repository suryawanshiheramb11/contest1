import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API
export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const checkAuth = async () => {
    const response = await api.get('/auth/check');
    return response.data;
};

// Questions API (Student view - with time-release)
export const getQuestions = async () => {
    const response = await api.get('/questions');
    return response.data;
};

export const getQuestionById = async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
};

// Questions API (Admin view - full access)
export const getAdminQuestions = async () => {
    const response = await api.get('/questions/admin/all');
    return response.data;
};

export const createQuestion = async (questionData) => {
    const response = await api.post('/questions', questionData);
    return response.data;
};

export const updateQuestion = async (id, questionData) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
};

export const deleteQuestion = async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
};

export default api;
