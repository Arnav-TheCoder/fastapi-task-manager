function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

export default Button;