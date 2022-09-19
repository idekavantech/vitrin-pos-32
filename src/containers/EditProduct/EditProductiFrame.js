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
import qs from "qs";

export function EditProductiFrame({ business, match }) {

  return (<iframe id="mainframe" src={`${business.get_vitrin_absolute_admin_url}/s/settings/products/${match.params.id}/?token=${axios.defaults.headers.common.Authorization.replace("Token ", "")}&no_layout=true&no_new_tab_on_order_click=true&iframe_from_pos=true`} className="w-100 h-100"></iframe>)
}

const mapStateToProps = createStructuredSelector({
  business: makeSelectBusiness()
});


const withConnect = connect(mapStateToProps);

export default compose(memo, withRouter, withConnect)(EditProductiFrame);
