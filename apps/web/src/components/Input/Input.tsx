import { useState, type ChangeEventHandler } from 'react';

const Input = ({ label, onClick, disabled = false }) => {
    const [value, setValue] = useState('');
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        console.log('change inut', event);
        setValue(event.target.value);
    };

    return (
        <input
            type="text"
            className="input w-full"
            onChange={handleChange}
            placeholder="Recipe url"
            tabIndex={0}
            onFocus={(event) => {
                event.target.select();
            }}
        ></input>
    );
};

export default Input;
