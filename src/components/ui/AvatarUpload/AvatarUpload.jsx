import React, { useState, useRef } from 'react';
import { FaUser, FaCamera, FaSpinner } from 'react-icons/fa';
import cloudinaryService from '../../../services/cloudinaryService';
import './AvatarUpload.css';

const AvatarUpload = ({ currentAvatar, onAvatarChange, size = 100, editable = true }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      // Temporary preview while uploading
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const uploadResult = await cloudinaryService.uploadImage(file);
      
      // Call parent callback with new avatar URL
      if (onAvatarChange) {
        onAvatarChange(uploadResult.url);
      }
      
      console.log('Avatar uploaded successfully:', uploadResult.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="avatar-upload-container">
      <div
        className={`avatar-wrapper ${editable ? 'editable' : ''} ${isUploading ? 'uploading' : ''}`}
        style={{ width: size, height: size }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={isUploading || !editable}
        />

        {/* Avatar Image or Default Icon */}
        <div className="avatar-display">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              <FaUser size={size * 0.5} />
            </div>
          )}
        </div>

        {/* Camera Button - Always Visible */}
        {editable && !isUploading && (
          <div className="camera-button">
            <FaCamera size={16} />
          </div>
        )}

        {/* Upload Overlay - Only when hovering or uploading */}
        {editable && (isHovered || isUploading) && (
          <div className="avatar-overlay">
            {isUploading ? (
              <>
                <FaSpinner className="spinner" size={24} />
                <span className="overlay-text">Uploading...</span>
              </>
            ) : (
              <>
                <FaCamera size={24} />
                <span className="overlay-text">Change photo</span>
              </>
            )}
          </div>
        )}
      </div>

      {editable && !isUploading && (
        <p className="avatar-hint">
          <FaCamera size={12} /> Click on the avatar to change the photo
        </p>
      )}
    </div>
  );
};

export default AvatarUpload;