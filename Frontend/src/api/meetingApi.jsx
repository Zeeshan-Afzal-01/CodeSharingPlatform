import api from './api'

export const getMeetingData=async(userId)=>{
    try {
        const response = await api.get(`/meeting/${userId}`);
        return response.data.data;

        
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError("Failed to load meetings.");
      }
}


export const getTeamMeetingData=async(TeamId)=>{
  try {
      const response = await api.get(`/meeting/teammeeting/${TeamId}`);
      return response.data.data;

      
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings.");
    }
}