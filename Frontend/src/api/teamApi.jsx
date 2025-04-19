import api from "./api";

export const getAllTeamsData=async()=>{

    try {
        const response = await api.get(`/team/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching team:", error);
    return [];
    }
}

export const getTeamData = async (userId) => {
  try {
    const response = await api.get(`/team/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};
