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

    console.log('=== CREATING POST ===');
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Image:', image);

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
      console.log(' Image added to post data');
    } else {
      console.log(' No image to add');
    }

    console.log('Final post data:', postData);

    // Send post data to parent component
    onCreatePost(postData);

    // Reset form fields
    setTitle('');
    setContent('');
    setImage(null);
  };

  const handleImageSelect = (base64Image) => {
    console.log('=== IMAGE SELECTED IN FORM ===');
    console.log('Image URL:', base64Image);
    console.log('Image type:', typeof base64Image);
    console.log('Image length:', base64Image?.length);
    setImage(base64Image);
  };

  const handleImageRemove = () => {
    console.log('=== IMAGE REMOVED IN FORM ===');
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
        <label>Image (optional) - {image ? ' Image selected' : ' No image'}</label>
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