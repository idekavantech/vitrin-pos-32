import React from "react";
import PropTypes from "prop-types";
import MaterialSelect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const Select = ({
  options,
  selectOption,
  inputData,
  onChange = () => {},
  onFocus = () => {},
  itemStyle,
  inputStyle,
  noIcon,
  containerStyle,
  disabled,
  ...props
}) => {
  const { label, value = "", defaultValue, className, placeholder } = inputData;
  return (
    <FormControl className="w-100" style={{ marginTop: 8 }}>
      <InputLabel id="select-label">{label}</InputLabel>
      <MaterialSelect
        labelId="select-label"
        className="w-100"
        value={defaultValue ? defaultValue : value}
        onChange={(e) => selectOption(e.target.value)}>
        {defaultValue && (
          <MenuItem className="d-none" value={defaultValue}>
            {defaultValue}
          </MenuItem>
        )}
        {options.map((o) => (
          <MenuItem key={o.id} value={o.text}>
            {o.text}
          </MenuItem>
        ))}
      </MaterialSelect>
    </FormControl>
  );
};
Select.propTypes = {
  options: PropTypes.array,
  selectOption: PropTypes.func,
  inputData: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  itemStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  noIcon: PropTypes.bool,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
};
export default Select;
