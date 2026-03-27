import axios from "axios";
export const createProfileService = async (data) => {
    try {
        // External API call (POST)
        const response = await axios.post("http://localhost:3002/api/matrimony/create-profile", // apni real API yaha daalo
        data);
        // API ka response return karo
        return response.data;
    }
    catch (error) {
        throw new Error("Service Error: " + error.message);
    }
};
