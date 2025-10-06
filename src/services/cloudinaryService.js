
const CLOUD_NAME = 'dnmaj73rg'; 
const UPLOAD_PRESET = 'codeleap_uploads'; 

const cloudinaryService = {
  /**
   * Upload image file to Cloudinary
   * @param {File} file - Image file
   * @returns {Promise<Object>} - Object with image URL and metadata
   */
  async uploadImage(file) {
    try {
      // Prepare form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      // Send upload request to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      // Handle upload errors
      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.status}`);
      }

      // Return image data from response
      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        thumbnail: data.thumbnail_url
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },

  /**
   * Upload Base64 string directly to Cloudinary
   * @param {string} base64Image - Base64 image string
   * @returns {Promise<string>} - Image URL
   */
  async uploadBase64(base64Image) {
    try {
      // Prepare form data with Base64 string
      const formData = new FormData();
      formData.append('file', base64Image);
      formData.append('upload_preset', UPLOAD_PRESET);

      // Send upload request
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      // Handle upload errors
      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.status}`);
      }

      // Return secure URL from response
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }
};

export default cloudinaryService;