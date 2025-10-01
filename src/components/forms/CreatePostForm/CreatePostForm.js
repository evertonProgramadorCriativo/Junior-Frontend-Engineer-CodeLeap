import React, { useState } from 'react';

import Button from '../../ui/Button/Button';
import { Input, TextArea } from '../../ui/Input/Input';
import ImageUpload from '../../ui/ImageUpload/ImageUpload';
import './CreatePostForm.css';

const CreatePostForm = ({ onCreatePost }) => {
 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
    };

    // Add image if provided
    if (image) {
      postData.image = image;
    }

    // Send post data to parent component
    onCreatePost(postData);

    // Reset form fields
    setTitle('');
    setContent('');
    setImage(null);
  };

  const handleImageSelect = (base64Image) => {
    setImage(base64Image);
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <h3>What's on your mind?</h3>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Hello world"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content here"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Image (optional)</label>
        <ImageUpload
          onImageSelect={handleImageSelect}
          currentImage={image}
          onImageRemove={handleImageRemove}
        />
      </div>

      <div className="form-actions">
        <Button
          type="submit"
          disabled={!title.trim() || !content.trim()}
        >
          CREATE
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;