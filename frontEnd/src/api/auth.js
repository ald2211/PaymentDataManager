import axios from "axios";

const baseUrl = process.env.BASE_URL;

// Login function using Axios
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // Return the response data
  } catch (err) {
    console.error("Error during login:", err.response?.data?.message || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

// Signup function using Axios
// export const signup = async (credentials) => {
//   try {
//     const response = await axios.post(`${baseUrl}/auth/register`, credentials, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data; // Return the response data
//   } catch (err) {
//     console.error("Error during signup:", err.response?.data?.message || err.message);
//     throw new Error(err.response?.data?.message || "Signup failed");
//   }
// };
