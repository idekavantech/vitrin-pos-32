/**
 *
 * AddNewItemSection
 *
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  calculateDiscountPercent,
  englishNumberToPersianNumber,
  priceFormatter,
} from "../../../utils/helper";

// import styled from 'styled-components';

function ProductPrice({ discountedPrice, initialPrice }) {
  const discountPercent = calculateDiscountPercent(initialPrice, discountedPrice);
  return initialPrice - discountedPrice ? (
    <div className="c-business-card-item-info d-flex flex-row-reverse align-items-center p-2 justify-content-between">
      <div className="d-flex flex-column u-textWhite">
        <div className="d-flex justify-content-end">
          {priceFormatter(initialPrice) && (
            <div className="u-font-semi-small u-text-line-through ml-3 text-right">
              {priceFormatter(initialPrice)}
            </div>
          )}

          <div className="d-flex flex-column u-textWhite">
            {discountPercent ? (
              <div
                className="c-btn-transparent-bg c-btn-discount u-font-semi-small u-border-radius-4"
                style={{ padding: "0 2px" }}>
                ٪<span>{englishNumberToPersianNumber(discountPercent)}</span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="u-fontMedium u-textWhite ml-1 text-right">
          <span className="u-fontWeightBold">{priceFormatter(discountedPrice)}</span>
          <span className="u-font-semi-small"> تومان </span>
        </div>
      </div>
    </div>
  ) : (
    priceFormatter(initialPrice) && (
      <div className="c-business-card-item-info d-flex justify-content-end align-items-center u-text-white p-2 u-fontMedium u-fontWeightBold">
        {priceFormatter(initialPrice)}
        <span className="u-font-semi-small mr-1 u-fontWeightNormal">تومان</span>
      </div>
    )
  );
}

ProductPrice.propTypes = {
  discountedPrice: PropTypes.number,
  initialPrice: PropTypes.number.isRequired,
};

export default memo(ProductPrice);
