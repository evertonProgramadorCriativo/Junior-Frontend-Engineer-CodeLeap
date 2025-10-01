import React from 'react';
import './Input.css';

const Input = ({ ...props }) => {
    return <input className="input-field" {...props} />;
};


const TextArea = ({ ...props }) => {
    return <textarea className="textarea-field" {...props} />;
};


const Label = ({ htmlFor, children, ...props }) => {
    return (
        <label htmlFor={htmlFor} className="label-field" {...props}>
            {children}
        </label>
    );
};



export {
    Input,
    TextArea,
    Label
};

