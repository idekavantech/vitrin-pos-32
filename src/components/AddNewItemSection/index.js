/**
 *
 * AddNewItemSection
 *
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import Add from "@material-ui/icons/Add";
import useTheme from "@material-ui/core/styles/useTheme";
import Button from "@material-ui/core/esm/Button";

import { handleKeyDown } from "../../../utils/helper";

function AddNewItemSection({
  className = "py-2 px-3",
  title,
  description,
  onClick,
  color,
  ...props
}) {
  const theme = useTheme();
  return (
    <Button
      className={`d-flex w-100 flex-column justify-content-center cursorPointer u-font-semi-small u-border-radius-4 ${className}`}
      style={{
        border: `1px dashed ${color || "#0050ff"}`,
        color: color || "#0050ff",
      }}
      onClick={onClick}
      onKeyDown={(e) => handleKeyDown(e, onClick)}
      role="button"
      tabIndex="0"
      {...props}
    >
      <div className="d-flex align-items-center">
        <div style={{ color }}>{description}</div>
        <Add fontSize="small" className="ml-1" />
        {title}
      </div>
    </Button>
  );
}

AddNewItemSection.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  align: PropTypes.string,
};

export default memo(AddNewItemSection);
