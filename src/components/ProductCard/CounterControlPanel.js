/**
 *
 * AddNewItemSection
 *
 */

import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Icon from '../Icon';
import {
  englishNumberToPersianNumber,
  handleKeyDown,
  useOutsideAlerter,
} from "../../../utils/helper";
import { ICONS } from "../../../assets/images/icons";

function CounterControlPanel({
  count,
  increment,
  decrement,
  themeColor,
  toggleControlMode,
  className,
  style,
}) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => toggleControlMode(false));

  return (
    <div
      className={`deal-card-control-mode ${className}`}
      style={style}
      ref={wrapperRef}
    >
      <Icon
        icon={ICONS.PLUS}
        size={12}
        color={themeColor}
        className="d-flex flex-1 justify-content-center u-cursor-pointer"
        onClick={increment}
      />
      <div>{englishNumberToPersianNumber(count)}</div>
      <div
        className="d-flex justify-content-center u-cursor-pointer"
        onClick={decrement}
        onKeyDown={e => handleKeyDown(e, decrement)}
        role="button"
        tabIndex="0"
      >
        {count > 1 ? (
          <Icon icon={ICONS.MINUS} size={25} color={themeColor} />
        ) : (
          <Icon size={19} icon={ICONS.TRASH} color={themeColor} />
        )}
      </div>
    </div>
  );
}

CounterControlPanel.propTypes = {
  count: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  themeColor: PropTypes.string.isRequired,
  toggleControlMode: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default memo(CounterControlPanel);
