/* eslint-disable react/no-danger */
/**
 *
 * Input
 *
 */

import React, { memo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/esm/TextField";
import { noOp } from "../../../utils/helper";

function Input({
  className = "direction-rtl",
  onChange = noOp,
  value,
  label,
  themeColor,
  noModal,
  numberOnly,
  style,
  variant = "outlined",
  editOnDoubleClick = false,
  onDoubleClick = noOp,
  onBlur = noOp,
  size = "",
  InputLabelProps = { className: "" },
  InputProps = { className: "" },
  ...props
}) {
  const [assistiveText, setAssistiveText] = useState("");
  const [editable, setEditable] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (editable) inputRef.current.focus();
  }, [editable]);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .MuiFilledInput-underline:after {
            border-bottom: 2px solid ${themeColor} !important;
          }
          .MuiFormLabel-root.Mui-focused {
            color: ${themeColor} !important;
        `,
        }}
      />
      <div className="w-100">
        <TextField
          InputLabelProps={{
            style: { textAlign: "left", direction: "rtl" },
          }}
          InputProps={{
            ...InputProps,
            className: `${size} ${InputProps.className}`,
          }}
          InputLabelProps={{
            ...InputLabelProps,
            className: `${size} medium ${InputLabelProps.className}`,
          }}
          inputProps={{ style }}
          fullWidth
          variant={variant}
          className={`u-fontLarge ${className}`}
          value={value}
          onChange={(e) => {
            if (numberOnly) {
              if (e.target.value.search(/[^0-9۰-۹]/g, "") !== -1)
                setAssistiveText("تنها مجاز به وارد کردن عدد هستید.");
              else setAssistiveText("");
              onChange(e.target.value.replace(/[^0-9۰-۹]/g, ""));
            } else onChange(e.target.value);
          }}
          inputRef={inputRef}
          label={label}
          onDoubleClick={(e) => {
            if (editOnDoubleClick) setEditable(true);

            onDoubleClick(e);
          }}
          onBlur={(e) => {
            if (editOnDoubleClick) setEditable(false);
            onBlur(e);
          }}
          disabled={props.disabled || (editOnDoubleClick && !editable)}
          {...props}
        />
        <div className="u-text-red u-font-semi-small mt-1">{assistiveText}</div>
      </div>
    </>
  );
}

Input.defaultProps = {
  className: "direction-rtl",
  themeColor: "#0050FF",
};

export default memo(Input);
