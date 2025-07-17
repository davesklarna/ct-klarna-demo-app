const Button = ({
  text,
  onClick,
  disabled,
  variant,
  type = "submit",
  className,
}) => {
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`text-white px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
        variant === "secondary"
          ? "bg-gray-400 disabled:bg-gray-300"
          : "bg-blue-500 disabled:bg-blue-300"
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
