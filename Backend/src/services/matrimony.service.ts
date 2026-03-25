import axios from "axios";

export const fetchMatrimonyData = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/matrimony-data"
    );

    return response.data;

  } catch (error: any) {
    throw new Error("Service Error: " + error.message);
  }
};