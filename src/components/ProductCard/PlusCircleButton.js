/**
 *
 * AddNewItemSection
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Icon from '../Icon';
import { ICONS } from "../../../assets/images/icons";
import { handleKeyDown, hexToRgb } from "../../../utils/helper";

function PlusCircleButton({ onClick, themeColor }) {
  return (
    <div
      // style={{ border: `2px solid ${themeColor}` }}
      className="add-product-icn position-absolute"
      onClick={onClick}
      color={`rgba(${hexToRgb(themeColor).r},${hexToRgb(themeColor).g},${
        hexToRgb(themeColor).b
      }, 0.3)`}
      onKeyDown={e => handleKeyDown(e, onClick)}
      role="button"
      tabIndex="0"
    >
      <Icon icon={ICONS.PLUS} size={12} color={themeColor} />
    </div>
  );
}

PlusCircleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  themeColor: PropTypes.string.isRequired,
};

PlusCircleButton.defaultProps = {};

export default memo(PlusCircleButton);
