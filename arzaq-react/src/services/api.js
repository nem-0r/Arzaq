// src/services/api.js
// API Service Layer - Ready for Backend Integration

// eslint-disable-next-line no-unused-vars
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth token
// eslint-disable-next-line no-unused-vars
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API responses
// eslint-disable-next-line no-unused-vars
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// API Service
const api = {
  // Authentication endpoints
  auth: {
    login: async (email, password) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
      */

      // Temporary mock implementation
      return { success: true, token: 'mock-token', user: { email } };
    },

    register: async (userData) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
      */

      // Temporary mock implementation
      return { success: true, user: userData };
    },

    logout: async () => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return handleResponse(response);
      */

      return { success: true };
    }
  },

  // Posts endpoints
  posts: {
    getAll: async (filters = {}) => {
      // BACKEND: Replace with actual API call
      /*
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/posts?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
      */

      // Temporary: Return from localStorage
      const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
      return { success: true, posts };
    },

    getById: async (postId) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
      */

      const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
      const post = posts.find(p => p.id === postId);
      return { success: true, post };
    },

    create: async (postData) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(postData)
      });
      return handleResponse(response);
      */

      // Temporary: Save to localStorage
      const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
      const newPost = {
        id: Date.now(),
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      posts.unshift(newPost);
      localStorage.setItem('community_posts', JSON.stringify(posts));

      return { success: true, post: newPost };
    },

    update: async (postId, postData) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(postData)
      });
      return handleResponse(response);
      */

      const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
      const index = posts.findIndex(p => p.id === postId);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...postData, updatedAt: new Date().toISOString() };
        localStorage.setItem('community_posts', JSON.stringify(posts));
      }

      return { success: true, post: posts[index] };
    },

    delete: async (postId) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return handleResponse(response);
      */

      const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
      const filtered = posts.filter(p => p.id !== postId);
      localStorage.setItem('community_posts', JSON.stringify(filtered));

      return { success: true };
    }
  },

  // Likes endpoints
  likes: {
    // Toggle like on a post
    toggleLike: async (postId, userId) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ userId })
      });
      return handleResponse(response);
      */

      // Temporary: Save to localStorage
      const likesKey = `post_${postId}_likes`;
      const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');

      const userIndex = likes.indexOf(userId);
      let isLiked;

      if (userIndex > -1) {
        // Unlike
        likes.splice(userIndex, 1);
        isLiked = false;
      } else {
        // Like
        likes.push(userId);
        isLiked = true;
      }

      localStorage.setItem(likesKey, JSON.stringify(likes));

      return {
        success: true,
        isLiked,
        likesCount: likes.length,
        likes
      };
    },

    // Get likes for a post
    getLikes: async (postId) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
      */

      // Temporary: Get from localStorage
      const likesKey = `post_${postId}_likes`;
      const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');

      return {
        success: true,
        likesCount: likes.length,
        likes
      };
    }
  },

  // Comments endpoints
  comments: {
    // Get comments for a post
    getComments: async (postId) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
      */

      // Temporary: Get from localStorage
      const commentsKey = `post_${postId}_comments`;
      const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');

      return {
        success: true,
        comments
      };
    },

    // Create a comment
    create: async (postId, commentData) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(commentData)
      });
      return handleResponse(response);
      */

      // Temporary: Save to localStorage
      const commentsKey = `post_${postId}_comments`;
      const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');

      const newComment = {
        id: Date.now(),
        postId,
        ...commentData,
        createdAt: new Date().toISOString()
      };

      comments.push(newComment);
      localStorage.setItem(commentsKey, JSON.stringify(comments));

      return {
        success: true,
        comment: newComment
      };
    },

    // Delete a comment
    delete: async (postId, commentId) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return handleResponse(response);
      */

      // Temporary: Remove from localStorage
      const commentsKey = `post_${postId}_comments`;
      const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
      const filtered = comments.filter(c => c.id !== commentId);

      localStorage.setItem(commentsKey, JSON.stringify(filtered));

      return {
        success: true
      };
    }
  },

  // Restaurants endpoints
  restaurants: {
    search: async (query) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/restaurants/search?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
      */

      // Temporary: Return mock data
      const mockRestaurants = [
        { id: 1, name: 'Green Garden Bistro', address: 'Almaty, Dostyk Ave' },
        { id: 2, name: 'Urban Deli', address: 'Almaty, Furmanov St' },
        { id: 3, name: 'Sushi Master', address: 'Almaty, Abai Ave' },
        { id: 4, name: 'Pasta Paradise', address: 'Almaty, Al-Farabi Ave' },
        { id: 5, name: 'Green Market', address: 'Almaty, Central Market' },
        { id: 6, name: 'Central Bakery', address: 'Almaty, Zhibek Zholy' }
      ];

      const filtered = query
        ? mockRestaurants.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
        : mockRestaurants;

      return { success: true, restaurants: filtered };
    }
  },

  // Upload endpoints
  upload: {
    // Upload image file
    image: async (file) => {
      // BACKEND: Replace with actual API call
      /*
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });
      return handleResponse(response);
      */

      // Temporary: Convert to base64 and store in localStorage
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result;

          // In production, this would return a URL from your CDN/storage
          // For now, we'll just return the base64 string as the URL
          resolve({
            success: true,
            url: base64String,
            filename: file.name,
            size: file.size,
            type: file.type
          });
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      });
    }
  },

  // User Impact / Stats endpoints
  impact: {
    // Get user's environmental impact statistics
    getStats: async (period = 'month') => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/impact/stats?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return handleResponse(response);
      */

      // Temporary: Return from localStorage or mock data
      const savedStats = localStorage.getItem('user_impact_stats');
      if (savedStats) {
        return { success: true, stats: JSON.parse(savedStats) };
      }

      // Default mock data
      return {
        success: true,
        stats: {
          mealsRescued: 23,
          co2Saved: 4.2,
          mealsGoal: 30,
          co2Goal: 10,
          badges: [
            {
              id: 1,
              name: 'Eco Warrior Badge',
              description: 'Earned for saving 20+ meals',
              icon: '🏆',
              earned: true
            }
          ],
          period: period,
          updatedAt: new Date().toISOString()
        }
      };
    },

    // Update impact stats (called after order completion)
    updateStats: async (orderData) => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/impact/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(orderData)
      });
      return handleResponse(response);
      */

      // Temporary: Update localStorage
      const savedStats = localStorage.getItem('user_impact_stats');
      const currentStats = savedStats ? JSON.parse(savedStats) : {
        mealsRescued: 0,
        co2Saved: 0,
        mealsGoal: 30,
        co2Goal: 10,
        badges: []
      };

      // Calculate CO2 saved (average: 0.18kg per meal)
      const co2PerMeal = 0.18;
      const newMeals = orderData.itemsCount || 1;
      const newCO2 = newMeals * co2PerMeal;

      const updatedStats = {
        ...currentStats,
        mealsRescued: currentStats.mealsRescued + newMeals,
        co2Saved: parseFloat((currentStats.co2Saved + newCO2).toFixed(1)),
        updatedAt: new Date().toISOString()
      };

      // Check for new badges
      if (updatedStats.mealsRescued >= 20 && !currentStats.badges.find(b => b.id === 1)) {
        updatedStats.badges.push({
          id: 1,
          name: 'Eco Warrior Badge',
          description: 'Earned for saving 20+ meals',
          icon: '🏆',
          earned: true
        });
      }

      if (updatedStats.mealsRescued >= 50 && !currentStats.badges.find(b => b.id === 2)) {
        updatedStats.badges.push({
          id: 2,
          name: 'Planet Hero',
          description: 'Earned for saving 50+ meals',
          icon: '🌟',
          earned: true
        });
      }

      localStorage.setItem('user_impact_stats', JSON.stringify(updatedStats));
      return { success: true, stats: updatedStats };
    },

    // Get all available badges
    getBadges: async () => {
      // BACKEND: Replace with actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/impact/badges`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
      */

      // Temporary: Return all possible badges
      return {
        success: true,
        badges: [
          {
            id: 1,
            name: 'Eco Warrior Badge',
            description: 'Earned for saving 20+ meals',
            icon: '🏆',
            requirement: 20
          },
          {
            id: 2,
            name: 'Planet Hero',
            description: 'Earned for saving 50+ meals',
            icon: '🌟',
            requirement: 50
          },
          {
            id: 3,
            name: 'Green Champion',
            description: 'Earned for saving 100+ meals',
            icon: '🌍',
            requirement: 100
          }
        ]
      };
    }
  }
};

export default api;
