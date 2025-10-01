const API_BASE_URL = 'https://dev.codeleap.co.uk/careers/';

const api = {
  async request(endpoint = '', options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // Posts
  getPosts() {
    return this.request();
  },

  createPost(data) {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

     updatePost(id, data) {
    return this.request(`${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deletePost(id) {
    return this.request(`${id}/`, {
      method: 'DELETE',
    });
  },
};

export default api;