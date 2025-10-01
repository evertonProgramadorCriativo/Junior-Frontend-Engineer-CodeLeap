import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../ui/Button/Button';
import { Input, TextArea } from '../../ui/Input/Input';
import './CreatePostForm.css';

const CreatePostForm = ({ onCreatePost }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      // username será adicionado no handleSubmit do App.js
    };

    // Chama a função passada via props
    onCreatePost(postData);
    
    // Limpa o formulário
    setTitle('');
    setContent('');
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