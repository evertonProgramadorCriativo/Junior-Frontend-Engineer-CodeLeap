import React, { useState } from 'react';
 import Button from '../../ui/Button/Button';
 import Modal from '../../ui/Modal/Modal';
import { 
  Input, 
  Textarea, 
  Label // Se quiser usar o genérico
} from '../../ui/Input/Input';
import './SignUpModal.css';

const SignUpModal = () => {
  const [username, setUsername] = useState('');
 

  const handleSubmit = () => {
    if (username.trim()) {
    return alert(`Welcome, ${username}!`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={true} onClose={() => {}}>
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