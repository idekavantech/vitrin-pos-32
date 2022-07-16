/* eslint-disable no-param-reassign */
import React from "react";
import PropTypes from "prop-types";
import useTheme from "@material-ui/core/styles/useTheme";
import { noOp } from "../../../utils/helper";
import { pollution } from "../../../utils/colors";

function TextSwitch({
  isSwitchOn,
  toggleSwitch,
  disabled,
  texts = ["", ""],
  className = "",
  themeColor,
  width = 260,
  height = 40,
}) {
  const theme = useTheme();
  themeColor = themeColor || theme.palette.primary.main;
  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={noOp}
      className={`d-flex position-relative u-border-radius-8 d-inline-block ${className} ${
        disabled ? "cursor-default" : "u-cursor-pointer"
      }`}
      onClick={() => {
        if (!disabled) toggleSwitch(!isSwitchOn);
      }}
      style={{
        width,
        height,
        opacity: disabled ? 0.4 : 1,
        boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="transition-primary u-border-radius-8 position-absolute m-1"
        style={{
          transform: `translateX(-${isSwitchOn ? width / 2 : 0}px)`,
          width: width / 2 - 10,
          opacity: 0.1,
          background: themeColor,
          height: "calc(100% - 10px)",
        }}
      />
      <div
        style={{
          width: width / 2,
          color: isSwitchOn ? pollution : themeColor,
          fontWeight: isSwitchOn ? "normal" : "bold",
        }}
        className="text-center u-border-radius-8 px-3 py-1 d-flex justify-content-center align-items-center"
      >
        {texts[0]}
      </div>
      <div
        style={{
          width: width / 2,
          color: !isSwitchOn ? pollution : themeColor,
          fontWeight: !isSwitchOn ? "normal" : "bold",
        }}
        className="text-center u-border-radius-8 px-3 py-1 d-flex justify-content-center align-items-center"
      >
        {texts[1]}
      </div>
    </div>
  );
}
TextSwitch.propTypes = {
  isSwitchOn: PropTypes.bool,
  toggleSwitch: PropTypes.func,
  disabled: PropTypes.bool,
  texts: PropTypes.array,
  className: PropTypes.string,
  themeColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};
export default TextSwitch;
