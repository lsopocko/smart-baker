import { on } from "events";

const Button = ({ label, onClick, disabled = false }) => {

const handleClick = (event) => {
  if (disabled) {
    event.preventDefault();
    return;
  }
  console.log('Button clicked:', label);
  console.log('click', onClick);
};

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-white ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
    >
      {label}
    </button>
  );
}

export default Button;