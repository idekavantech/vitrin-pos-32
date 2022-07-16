import React from "react";

function CheckBox({ text, onChange, checked, label, className = "" }) {
  return (
    <label className={`checkbox-container mb-0 ${className}`} htmlFor={label}>
      <input
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
        id={label}
      />
      <span className="checkmark" />
      {text}
    </label>
  );
}
export default CheckBox;
