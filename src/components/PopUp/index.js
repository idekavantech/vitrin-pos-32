/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { memo } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

function Popup({ open, onClose, text, onSubmit, submitText, closeText }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div className="u-fontNormal">{text}</div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>{submitText}</Button>

        <Button onClick={onClose} color="primary">
          {closeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Popup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default memo(Popup);
