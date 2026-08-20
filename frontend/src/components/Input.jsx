function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
}) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default Input;