import api from './api'

export const getMessagesData = async (userId) => {
    try {
        if (!userId) {
            console.log("No user ID provided");
            return [];
        }
        
        const response = await api.get(`/message/user/${userId}`);
        return response.data.data || [];
    } catch (err) {
        if (err.response?.status === 400) {
            console.error("Invalid user ID format");
        } else if (err.response?.status === 404) {
            console.error("User not found");
        } else {
            console.error("Error fetching messages:", err);
        }
        return [];
    }
}