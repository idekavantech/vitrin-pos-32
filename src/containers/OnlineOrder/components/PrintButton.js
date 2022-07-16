import React, { memo } from "react";
import PropTypes from "prop-types";
import Icon from "../../../components/Icon";
import { ICONS } from "../../../../assets/images/icons";
import ButtonLoading from "../../../components/Button/Loading";

function PrintButton({ print, loading, text }) {
  return (
    <>
      <div
        onClick={print}
        className="u-border-radius-8 mx-2 px-2 w-100 u-cursor-pointer d-flex justify-content-center align-items-center u-background-primary-blue">
        {!loading && (
          <Icon
            icon={ICONS.PRINT}
            color="white"
            size={19}
            width={24}
            height={24}
            className="d-flex"
          />
        )}
        <button type="button" className="u-text-white d-inline-block mr-1">
          {loading ? <ButtonLoading /> : text}
        </button>
      </div>
    </>
  );
}

PrintButton.propTypes = {
  print: PropTypes.func,
  loading: PropTypes.bool,
  text: PropTypes.string,
};

export default memo(PrintButton);
