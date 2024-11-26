import axios from "axios";

const baseUrl = process.env.BASE_URL;
const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

export const createEntry = async (formData) => {
  try {
    const response = await axios.post(`${baseUrl}/entries`, formData,{ headers: headers() });
    return response.data; 
  } catch (err) {
    console.error("Error creating entry:", err.message); 
    throw err; 
  }
};

export const updateAnEntry = async (id,updatedData) => {
  try {
    const response = await axios.put(`${baseUrl}/entries/${id}`, updatedData,{ headers: headers() });
    return response.data; 
  } catch (err) {
    console.error("Error creating entry:", err.message); 
    throw err; 
  }
};

export const fetchAllEntries = async () => {
  try {
    const response = await axios.get(`${baseUrl}/entries`, {
      headers: headers(),
    });
    return response.data; // Return the response data
  } catch (err) {
    console.error("Error fetching user events:", err.response?.data?.message || err.message);
    throw new Error(err.response?.data?.message || "Failed to fetch events");
  }
};

export const deleteAnEntry = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/entries/${id}`, {
        headers: headers(),
      });
      return response.data; 
    } catch (err) {
      console.error("Error deleting event:", err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || "Failed to delete event");
    }
  };

  export const convertToExcel = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${baseUrl}/entries/export`, {
        headers: headers(),
        params: { startDate, endDate }, // Pass the date parameters
        responseType: "blob", // Ensure the response is treated as a file (binary data)
      });
      
       return response.data
    } catch (err) {
      console.error("Error exporting data to Excel:", err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || "Failed to export data");
    }
  };