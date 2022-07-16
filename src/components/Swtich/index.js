/**
 *
 * Switch
 *
 */

import React, { memo } from "react";
import ReactSwitch from "react-switch";

import PropTypes from "prop-types";
// import styled from 'styled-components';

function Switch({ isSwitchOn = false, toggleSwitch, id, themeColor, onColor }) {
  return (
    <label
      className="d-flex u-text-dark-grey u-fontMedium u-cursor-pointer"
      htmlFor={id}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ReactSwitch
        checked={isSwitchOn}
        onChange={() => toggleSwitch(!isSwitchOn)}
        onColor={onColor || "#0050FF"}
        offColor="#747474"
        onHandleColor={themeColor || "#0050FF"}
        offHandleColor={themeColor || "#667e8a"}
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={14}
        width={34}
        className="react-switch"
        id={id}
      />
    </label>
  );
}

Switch.propTypes = {
  isSwitchOn: PropTypes.bool,
  toggleSwitch: PropTypes.func,
  id: PropTypes.string,
  themeColor: PropTypes.string,
  onColor: PropTypes.string,
};

export default memo(Switch);
