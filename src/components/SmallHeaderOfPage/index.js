import React, { memo } from "react";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { graphite, night } from "../../../utils/colors";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function SmallHeaderOfPage({ title, history }) {
  const matches = useMediaQuery("(min-width:576px)");
  return (
    <Paper elevation={1} className="mt-2 p-1">
      <div className="d-flex align-items-center position-relative">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={history.goBack}
          className="mr-1"
        >
          <ChevronRightIcon fontSize="large" style={{ color: night }} />
        </IconButton>
        <div
          style={{ color: graphite }}
          className={
            "position-absolute text-center w-100 mx-auto  no-event " +
            (matches ? "u-fontLarge" : "u-fontMedium")
          }
        >
          {title}
        </div>
      </div>
    </Paper>
  );
}

SmallHeaderOfPage.propTypes = {
  title: PropTypes.string,
};

export default memo(withRouter(SmallHeaderOfPage));
