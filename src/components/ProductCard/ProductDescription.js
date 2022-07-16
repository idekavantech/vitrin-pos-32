/* eslint-disable react/no-danger */
/**
 *
 * AddNewItemSection
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ellipseText } from "../../../utils/helper";
// import styled from 'styled-components';

function ProductDescription({ title }) {
  return (
    <div>
      <div className="u-fontNormal u-text-darkest-grey mt-1 u-fontWeightBold text-right overflow-hidden">
        {ellipseText(title, 40)}
      </div>
    </div>
  );
}

ProductDescription.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default memo(ProductDescription);
