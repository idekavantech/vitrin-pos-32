import React, { memo } from "react";
import PropTypes from "prop-types";
import Icon from "../../../components/Icon";
import { ICONS } from "../../../../assets/images/icons";
import Modal from "../../../components/Modal";
function PrintModal({ isOpen, accept, print, _onClose }) {
  return (
    <Modal isOpen={isOpen}>
      <div className="u-relative u-background-white c-modal-box" style={{ width: 330 }}>
        <Icon
          onClick={_onClose}
          size={25}
          icon={ICONS.CLOSE}
          color="#ccd4d7"
          className="u-cursor-pointer u-absolute u-top-0 right-0 m-3"
        />

        <div className="d-flex flex-column flex-1 u-mt-50 py-3 u-border-top-5 px-2">
          <div className="u-text-black u-fontMedium u-fontWeightBold px-2">
            نحوه تایید سفارش را مشخص کنید:
          </div>
          <div className="d-flex mt-3">
            <div
              onClick={() => {
                accept();
                print();
                _onClose();
              }}
              className="u-border-radius-8 mx-1 p-2 w-100 u-cursor-pointer d-flex flex-column justify-content-center align-items-center u-background-primary-blue">
              <Icon
                icon={ICONS.PRINT}
                color="white"
                size={19}
                width={24}
                height={24}
                className="d-flex"
              />
              <button type="button" className="u-text-white d-inline-block mr-1 mt-1">
                تایید و پرینت
              </button>
            </div>
            <div
              onClick={() => {
                accept();
                _onClose();
              }}
              className="u-border-radius-8 mx-1 px-2 w-100 u-cursor-pointer d-flex flex-column justify-content-center align-items-center u-background-primary-light-blue">
              <Icon width={19} height={15} icon={ICONS.TICK} color="white" />
              <button type="button" className="u-text-white d-inline-block mr-1 mt-1">
                تایید بدون پرینت
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

PrintModal.propTypes = {
  _onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  accept: PropTypes.func,
  print: PropTypes.func,
};
export default memo(PrintModal);
