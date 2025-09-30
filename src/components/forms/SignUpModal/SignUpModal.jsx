import React, { useState } from 'react';
import Button from '../../ui/Button/Button';
import Modal from '../../ui/Modal/Modal';
import { 
  Input, 
  Textarea, 
  Label
} from '../../ui/Input/Input';
import './SignUpModal.css';

const SignUpModal = ({ isOpen, onSignUp, onClose }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      onSignUp(username.trim());
      setUsername(''); // Clear input after sign up
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="signup-modal">
        <h2>Welcome to CodeLeap network!</h2>
        <div>
          <label htmlFor="username">Please enter your username</label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="John doe"
            autoFocus // Focus input when modal opens
          />
          <Button
            onClick={handleSubmit}
            disabled={!username.trim()}
          >
            ENTER
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;