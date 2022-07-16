/**
 *
 * Modal
 *
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import MaterialModal from "@material-ui/core/esm/Modal";
import Fade from "@material-ui/core/esm/Fade";
import Backdrop from "@material-ui/core/esm/Backdrop";

function Modal({ isOpen, onClose, className = "", children }) {
  if (isOpen) {
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
  } else {
    document.getElementsByTagName("body")[0].style.overflowY = "unset";
    document.getElementsByTagName("html")[0].style.overflowY = "unset";
  }
  return (
    <MaterialModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      className={`d-flex align-items-center ${className}`}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}>
      <Fade in={isOpen}>{children}</Fade>
    </MaterialModal>
  );
}

export default memo(Modal);
