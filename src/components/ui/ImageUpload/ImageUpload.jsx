import React, { useState, useRef, useEffect } from 'react';
import './ImageUpload.css';
import { FaImage, FaTimes, FaSpinner } from 'react-icons/fa';
import cloudinaryService from '../../../services/cloudinaryService';

const ImageUpload = ({ onImageSelect, currentImage, onImageRemove }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Update preview when currentImage changes (used in editing)
  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type is image
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Show immediate local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      setIsUploading(true);
      try {
        const uploadResult = await cloudinaryService.uploadImage(file);
        
        // Return hosted image URL to parent
        onImageSelect(uploadResult.url);
        
        console.log('Image uploaded successfully:', uploadResult.url);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload image. Please try again.');
        setPreview(currentImage || null); // Restore previous image if exists
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleButtonClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isUploading}
      />

      {!preview ? (
        // Upload button when no image is selected
        <button
          type="button"
          className="upload-button"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <FaSpinner className="spinner" size={20} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FaImage size={20} />
              <span>Add Image</span>
            </>
          )}
        </button>
      ) : (
        // Image preview when image is selected
        <div className="image-preview-container">
          {isUploading && (
            <div className="upload-overlay">
              <FaSpinner className="spinner" size={32} />
              <p>Uploading...</p>
            </div>
          )}
          <img src={preview} alt="Preview" className="image-preview" />
          {!isUploading && (
            <button
              type="button"
              className="remove-image-button"
              onClick={handleRemoveImage}
              title="Remove image"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;