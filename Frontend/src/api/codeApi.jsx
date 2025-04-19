import api from './api'

export const getCodeData =async(userId) => {
      try {
        const response = await api.get(`/code/${userId}`);
        return response.data.data;

        
      } catch (err) {
        console.error("Error fetching code:", err);
        setError("Failed to load code snippets.");
      }
    };

