/* eslint-disable no-param-reassign */
/* eslint-disable indent */

/**
 *
 * CategoriesHandler
 *
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import useTheme from "@material-ui/core/styles/useTheme";
import Button from "@material-ui/core/esm/Button";
import { noOp } from "../../../utils/helper";
// import styled from 'styled-components';

function CategoriesItem({ onClick, themeColor, category, selected }) {
  const theme = useTheme();
  themeColor = themeColor || theme.palette.primary.main;
  return (
    <Button
      onClick={onClick}
      onKeyDown={noOp}
      className="py-1 px-2 u-cursor-pointer u-no-wrap"
      style={
        selected
          ? {
              color: themeColor,
              fontWeight: "bold",
              borderRadius: 16,
              boxShadow:
                "0px 1px 4px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.04)",
            }
          : { borderRadius: 16, color: "#667e8a" }
      }
    >
      {category.name}
    </Button>
  );
}

CategoriesItem.propTypes = {
  onClick: PropTypes.func,
  themeColor: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default memo(withRouter(CategoriesItem));
