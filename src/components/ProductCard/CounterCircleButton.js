/**
 *
 * AddNewItemSection
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { englishNumberToPersianNumber, handleKeyDown } from "../../../utils/helper";
// import styled from 'styled-components';


function CounterCircleButton({ onClick, themeColor, count }) {
  return (
    <div
      className="add-product-icn decreasable"
      style={{ backgroundColor: themeColor, border: '2px solid white' }}
      onClick={onClick}
      onKeyDown={e => handleKeyDown(e, onClick)}
      role="button"
      tabIndex="0"
    >
      {englishNumberToPersianNumber(count)}
    </div>
  );
}

CounterCircleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  themeColor: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

CounterCircleButton.defaultProps = {};

export default memo(CounterCircleButton);
