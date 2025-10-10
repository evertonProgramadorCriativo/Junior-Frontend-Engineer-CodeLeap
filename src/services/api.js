const API_BASE_URL = 'https://dev.codeleap.co.uk/careers/';

const api = {
  // Generic request handler for all API calls
  async request(endpoint = '', options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Throw error for failed requests
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
       // For DELETE requests, don't try to parse JSON (response is empty)
    if (options.method === 'DELETE') {
      return { success: true };
    }
    // Return parsed JSON response
    return response.json();
  },

  // GET - Fetch all posts
  getPosts() {
    return this.request();
  },

  // POST - Create new post
  createPost(data) {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PATCH - Update existing post
  updatePost(id, data) {
    return this.request(`${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE - Remove post
  deletePost(id) {
    return this.request(`${id}/`, {
      method: 'DELETE',
    });
  },
};

export default api;