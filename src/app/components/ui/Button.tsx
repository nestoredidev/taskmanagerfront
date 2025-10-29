import React from 'react';

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    name: string
}

function Button({type, onClick, name, ...rest}: ButtonProps) {
    return (
        <button type={type} onClick={onClick} {...rest}
                className="text-gray-600 hover:text-white hover:font-semibold px-3 py-2 rounded-md text-sm font-medium bg-teal-400 border-amber-500 border-2"
        >
            {name}
        </button>

    );
}

export default Button;