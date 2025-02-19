import axios from 'axios';

const apiBaseUrl = 'https://openrouter.ai/api';
const API_KEY = "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"; // Remplace par ta clé API

export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error.message);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/${endpoint}`, data, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://192.168.1.173:4000", // Optionnel
        "X-Title": "Anthony-Ai", // Optionnel
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la requête API :', error.message);
    throw error;
  }
};


export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(`${apiBaseUrl}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données :', error.message);
    throw error;
  }
};

export const putData = async (endpoint,payload) => {
  try {
    const response = await axios.put(`${apiBaseUrl}/${endpoint}`,payload);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données :', error.message);
    throw error;
  }
};

export const refreshPage = () => {
  window.location.reload();
};

