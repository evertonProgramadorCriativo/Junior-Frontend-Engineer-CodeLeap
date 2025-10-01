import React, { useState, useEffect } from 'react';
import { usePosts } from '../../../hooks/usePosts';
import Button from '../../ui/Button/Button';
import { Input, TextArea } from '../../ui/Input/Input';
import Modal from '../../ui/Modal/Modal';
import './EditModal.css';
import { FaTrash, FaEdit, FaUser, FaClock } from 'react-icons/fa';

const EditModal = ({ isOpen, post, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updatePost } = usePosts();

    // Initialize form with post data when modal opens
    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.content || '');
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e?.preventDefault();

        // Validate form and check if post exists
        if (title.trim() && content.trim() && post) {
            setIsSubmitting(true);
            try {
                await updatePost(post.id, {
                    title: title.trim(),
                    content: content.trim()
                });

                // Close modal after successful update
                onClose();
                if (onSuccess) onSuccess();

            } catch (error) {
                console.error('Error updating post:', error);
                alert('Error updating post. Please try again.');
                // Keep modal open on error
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Handle Enter key press for form submission
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!post) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="edit-modal">
                <h2>Edit item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="edit-title">Title</label>
                        <Input
                            type="text"
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Hello world"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-content">Content</label>
                        <TextArea
                            id="edit-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content here"
                            rows={4}
                        />
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                           <FaTrash size={16} /> Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!title.trim() || !content.trim() || isSubmitting}
                            loading={isSubmitting}
                        >
                            <FaEdit size={16} /> Save
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditModal;