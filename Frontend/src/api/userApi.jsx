import api from "./api";



export const getAllUserData=async()=>{

    try {
        const response = await api.get(`/users/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
    return [];
    }
}

export const getUserData=async(userId)=>{

    try {
        // console.log(userId);
        const response =await api.get(`/users/info/${userId}`);
        // console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
    return [];
    }
}