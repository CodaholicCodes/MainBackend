// import axios from "axios";

// export const fetchMatrimonyData = async () => {
//   try {
//     const response = await axios.get(
//       "http://127.0.0.1:8000/matrimony-data"
//     );

//     return response.data;

//   } catch (error: any) {
//     throw new Error("Service Error: " + error.message);
//   }
// };


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