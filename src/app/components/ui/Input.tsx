import React from 'react';

        interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
            placeholder?: string;
            value?: string;
            onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
            type?: string;
            className?: string;
        }

        function Input({
            placeholder,
            value,
            onChange,
            type = 'text',
            className = '',
            ...rest
        }: InputProps) {
            return (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    {...rest}
                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                />
            );
        }

        export default Input;