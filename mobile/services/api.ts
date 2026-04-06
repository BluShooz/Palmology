import axios from 'axios';

const API_URL = 'YOUR_BACKEND_URL_HERE'; // Replace with your deployed backend URL

export async function analyzePalm(base64Image: string) {
  try {
    const response = await axios.post(`${API_URL}/analyze_mobile`, {
      image: base64Image,
    });

    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to analyze palm',
    };
  }
}
