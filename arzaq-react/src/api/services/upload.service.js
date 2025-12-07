// src/api/services/upload.service.js
import apiClient from '../client';

/**
 * Upload Service - загрузка файлов
 */
const uploadService = {
  /**
   * Загрузить изображение
   * @param {File} file - файл изображения
   * @returns {Promise<Object>} - {success, url, filename, size, content_type}
   */
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/api/posts/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  },

  /**
   * Удалить изображение
   * @param {string} filename - имя файла
   * @returns {Promise<Object>}
   */
  async deleteImage(filename) {
    try {
      const response = await apiClient.delete('/api/upload/image', {
        params: { filename },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw error;
    }
  },
};

export default uploadService;
