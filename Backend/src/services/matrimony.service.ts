import axios from "axios";

export const createProfileService = async (data: any) => {
  try {
    // 🔥 External API call (POST)
    const response = await axios.post(
      "https://api.example.com/create-profile", // 👉 apni real API yaha daalo
      data
    );

    // API ka response return karo
    return response.data;

  } catch (error: any) {
    throw new Error("Service Error: " + error.message);
  }
};