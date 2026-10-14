// src/api/aiApi.js
// AI food advisor and KFT Assistant chatbot (backend: /api/ai).
import axiosInstance from './axiosConfig';

const API_URL = '/ai';

// The model can take a while to think, so allow more than the default 30 s. The AI
// screens show their own error messages, so the global error toast is suppressed.
const AI_OPTIONS = { timeout: 90000, skipErrorToast: true };

export const aiApi = {
  getHealthProfile: async () => {
    const response = await axiosInstance.get(`${API_URL}/health-profile`);
    return response.data;
  },

  saveHealthProfile: async (profile) => {
    const response = await axiosInstance.put(`${API_URL}/health-profile`, profile);
    return response.data;
  },

  deleteHealthProfile: async () => {
    const response = await axiosInstance.delete(`${API_URL}/health-profile`);
    return response.data;
  },

  // { query, use_profile, allergies?, lat?, lng? }
  recommend: async (payload) => {
    const response = await axiosInstance.post(`${API_URL}/recommend`, payload, AI_OPTIONS);
    return response.data;
  },

  // { notes?, lat?, lng? }
  mealPlan: async (payload = {}) => {
    const response = await axiosInstance.post(`${API_URL}/meal-plan`, payload, AI_OPTIONS);
    return response.data;
  },

  // { message, history: [{ role: 'user' | 'assistant', content }], lat?, lng? }
  chat: async (payload) => {
    const response = await axiosInstance.post(`${API_URL}/chat`, payload, AI_OPTIONS);
    return response.data;
  },
};

// Human-readable message for a failed AI call.
export const aiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.code === 'ECONNABORTED') return 'The AI is taking too long. Please try again.';
  return error?.response?.data?.message || fallback;
};

export default aiApi;
