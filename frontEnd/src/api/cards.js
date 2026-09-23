import axios from "axios";

const baseUrl = process.env.BASE_URL;
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchAllCards = async () => {
  try {
    const response = await axios.get(`${baseUrl}/cards`, {
      headers: headers(),
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching cards:", err.response?.data?.message || err.message);
    throw new Error(err.response?.data?.message || "Failed to fetch cards");
  }
};

export const createCard = async (cardData) => {
  try {
    const response = await axios.post(`${baseUrl}/cards`, cardData, {
      headers: headers(),
    });
    return response.data;
  } catch (err) {
    console.error("Error creating card:", err.response?.data?.message || err.message);
    throw new Error(err.response?.data?.message || "Failed to create card");
  }
};

export const updateCard = async (id, cardData) => {
  try {
    const response = await axios.put(`${baseUrl}/cards/${id}`, cardData, {
      headers: headers(),
    });
    return response.data;
  } catch (err) {
    console.error("Error updating card:", err.response?.data?.message || err.message);
    throw new Error(err.response?.data?.message || "Failed to update card");
  }
};

export const deleteCard = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/cards/${id}`, {
      headers: headers(),
    });
    return response.data;
  } catch (err) {
    console.error("Error deleting card:", err.response?.data?.message || err.message);
    throw new Error(err.response?.data?.message || "Failed to delete card");
  }
};
