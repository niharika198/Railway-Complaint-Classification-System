const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = {
  async post(endpoint, data, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.detail || "Something went wrong. Please try again.",
      );
    }

    return result;
  },

  async get(endpoint, token = null) {
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.detail || "Something went wrong. Please try again.",
      );
    }

    return result;
  },

  async patch(endpoint, data, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.detail || "Something went wrong. Please try again.",
      );
    }

    return result;
  },
};

export default api;
