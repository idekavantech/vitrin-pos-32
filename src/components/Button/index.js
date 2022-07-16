import React from 'react';
import PropTypes from 'prop-types';
import ButtonLoading from './Loading';
import { CDN_BASE_URL } from '../../../utils/api';
const editPen = `${CDN_BASE_URL}edit-pen-blue.svg`;

const EditButton = ({ text = 'ویرایش', onClick, isLoading, ...props }) => (
  <button
    className="u-cursor-pointer"
    onClick={onClick}
    type="button"
    {...props}
  >
    <img src={editPen} alt="" />
    <span className="u-text-primary-light-blue u-font-semi-small">{text}</span>
  </button>
);
EditButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
};
const PrimaryButton = ({
  text,
  className,
  onClick,
  bgColor,
  imageSrc,
  isLoading,
  transparent,
  disabled,
  style,
  ...props
}) => (
  <button
    style={{ backgroundColor: bgColor, ...style }}
    className={`c-btn c-btn-blue c-btn-primary u-fontSemiSmall ${className} ${
      isLoading || disabled ? 'disabled' : null
    }`}
    onClick={onClick}
    disabled={disabled || isLoading}
    type="button"
    tabIndex="0"
    {...props}
  >
    {isLoading ? (
      <ButtonLoading />
    ) : (
      <>
        {imageSrc && (
          <img src={imageSrc} alt="بهترینو" className="ml-1" />
        )}
        {text}
      </>
    )}
  </button>
);
PrimaryButton.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  bgColor: PropTypes.string,
  imageSrc: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  transparent: PropTypes.string,
};
export { EditButton, PrimaryButton };
