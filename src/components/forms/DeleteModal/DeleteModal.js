import React, { useState } from 'react';
import { usePosts } from '../../../hooks/usePosts';
import Button from '../../ui/Button/Button';
import Modal from '../../ui/Modal/Modal';
import './DeleteModal.css'; 

const DeleteModal = ({ isOpen, post, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deletePost } = usePosts();

  const handleConfirm = async () => {
    if (!post) return;
    
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      onClose();
      if (onSuccess) onSuccess(); // Optional success callback
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="delete-modal">
        <h2>Are you sure you want to delete this item?</h2>
        <div className="modal-actions">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;