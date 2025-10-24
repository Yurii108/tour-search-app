import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ children, style, ...props }) => {
    const baseStyle: React.CSSProperties = {
        padding: '10px',
        backgroundColor: '#4C6EF5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        ...style,
    };

    return (
        <button style={baseStyle} {...props}>
            {children}
        </button>
    );
};

export default Button;
