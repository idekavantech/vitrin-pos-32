/* eslint-disable react/no-danger */
/**
 *
 * AdminOrder
 *
 */

import React, { memo } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import {
  makeSelectBusiness,
} from "../../../stores/business/selector";
import axios from "axios";

export function Labels({
  business,
}) {
  return <iframe src={`${business.get_vitrin_absolute_admin_url}/s/settings/l?token=${axios.defaults.headers.common.Authorization.replace("Token ", "")}&no_layout=true`} className="w-100 h-100"></iframe>

}

const mapStateToProps = createStructuredSelector({
  business: makeSelectBusiness(),
});

function mapDispatchToProps() {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(memo, withRouter, withConnect)(Labels);
