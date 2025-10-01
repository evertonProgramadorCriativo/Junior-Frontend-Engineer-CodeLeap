import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePosts } from '../../../contexts/PostsContext';
import Button from '../../ui/Button/Button';
import Modal from '../../ui/Modal/Modal';
import { Input, TextArea } from '../../ui/Input/Input';
import ImageUpload from '../../ui/ImageUpload/ImageUpload';
import './PostCard.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { updatePost, deletePost } = usePosts();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState(post.image || null);

  // Check if current user owns this post
  const isOwner = user === post.username;

  const handleEdit = async () => {
    // Validate form fields
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const updateData = {
        title: editTitle.trim(),
        content: editContent.trim(),
      };

      // Add image if exists
      if (editImage) {
        updateData.image = editImage;
      }

      await updatePost(post.id, updateData);
      setIsEditModalOpen(false);
    } catch (err) {
      alert('Error updating post: ' + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert('Error deleting post: ' + err.message);
    }
  };

  const handleImageSelect = (base64Image) => {
    setEditImage(base64Image);
  };

  const handleImageRemove = () => {
    setEditImage(null);
  };

  return (
    <>
      <div className="post-card">
        <div className="post-header">
          <h3>{post.title}</h3>
          {isOwner && (
            <div className="post-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  // Reset form with current post data
                  setEditTitle(post.title);
                  setEditContent(post.content);
                  setEditImage(post.image || null);
                  setIsEditModalOpen(true);
                }}
              >
                <FaEdit size={16} />
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <FaTrash size={16} />
              </Button>
            </div>
          )}
        </div>

        <div className="post-body">
          <div className="post-image-container">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="post-image"
                onError={(e) => {
                  console.warn('Image failed to load:', post.image);
                  e.target.onerror = null; // Prevent error loop
                  e.target.src = '/logo.jpg'; // Fallback image
                }}
              />
            ) : (
              <div className="post-image-placeholder">
                <img
                  src="https://i.ibb.co/nNBHRQNk/Screenshot-20.png"
                  alt="Post content"
                  className="post-image"
                />
              </div>
            )}
          </div>

          <p className="post-content">{post.content}</p>
        </div>

        <small className="post-meta">
          By: {post.username} | {new Date(post.created_datetime).toLocaleString()}
        </small>
      </div>

      {/* Edit post modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="edit-modal">
          <h3>Edit Post</h3>
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <Input
              type="text"
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-content">Content</label>
            <TextArea
              id="edit-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              currentImage={editImage}
              onImageRemove={handleImageRemove}
            />
          </div>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleEdit}
              disabled={!editTitle.trim() || !editContent.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="delete-modal">
          <h3>Are you sure you want to delete this post?</h3>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PostCard;