/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * CategoryHeader
 *
 */

import React, { memo, useState } from "react";
import PropTypes from "prop-types";

function CategoryHeader({ categoryName}) {
  return (
    <div>
      <div className="d-flex mx-1 justify-content-between u-textBlack align-items-center">
        <span className="u-fontWeightBold">
          {categoryName}
        </span>
      </div>
      <div className="d-flex text-center align-items-center mt-4">
        <div className="col-2 px-0 d-flex align-items-center">
          <div className="col-4 px-0" />
          <div className="col-8  pl-0 text-right pr-3">نام محصول</div>
        </div>
        <div className="col-8 px-4 d-flex">
          <div className="col-3 px-0">قیمت واحد (تومان)</div>
          <div className="col-3 px-0">میزان تخفیف (تومان)</div>
          <div className="col-2 px-0">درصد تخفیف</div>
          <div className="col-3 px-0">قیمت با تخفیف</div>
          <div className="col-1 px-0">موجودی</div>
        </div>
        <div className="col-2 px-0 d-flex">
          <div className="col-10 px-0" />
          <div className="col-2 px-0" />
        </div>
      </div>

    </div>
  );
}

CategoryHeader.propTypes = {
  categoryName: PropTypes.string,
  themeColor: PropTypes.string,
  showMoreBtnOnClick: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default memo(CategoryHeader);
