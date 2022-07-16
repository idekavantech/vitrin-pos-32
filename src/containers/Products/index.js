/* eslint-disable react/no-danger */
/**
 *
 * AdminOrder
 *
 */

import React, { memo, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
const { shell } = require("electron");
import Button from "@material-ui/core/esm/Button";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";

import {
  makeSelectBusiness,
  makeSelectBusinessAddress,
  makeSelectCategories,
} from "../../../stores/business/selector";
import TextField from "@material-ui/core/esm/TextField";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
import { useInjectReducer } from "../../../utils/injectReducer";
import reducer from "./reducer";
import { useInjectSaga } from "../../../utils/injectSaga";
import saga from "./saga";
import { getDeals, getUnavailableDeals } from "./actions";
import CategoryModal from "./CategoryModal";
import CategoriesList from "../../components/CategoriesList";
import CategoryPresentation from "../../components/CategoryPresentation";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  makeSelectFilteredDeals,
  makeSelectFilteredDealsPagination,
  makeSelectUnavailableDeals,
  makeSelectUnavailableDealsPagination,
} from "./selectors";
import { updateProduct } from "../../../stores/business/actions";
import Switch from "../../components/Swtich";
import { getQueryParams } from "../../../utils/helper";
import axios from "axios";

export function Products({
  address,
  categories,
  _changeCategoryOrder,
  _updateProduct,
  history,
  deals,
  pagination,
  _getDeals,
  match: { params },
  _getUnavailableDeals,
  unavailableDeals,
  unavailableDealsPagination,
  business,
  token
}) {
  useInjectReducer({ key: "products", reducer });
  useInjectSaga({ key: "products", saga });
  const [listView, setListView] = useState(
    !localStorage.getItem("productsCardView")
  );
  const [search, setSearch] = useState("");
  const [categoryModal, setCategoryModal] = useState(false);
  const [filters, setFilters] = useState({});
  const { id } = params;
  const category = categories.find((c) => c.id === +id) || {
    id: "all",
    name: "همه محصولات",
  };
  const reload = () => {
    const _categories = [];
    if (id !== "all") _categories.push(id);
    _getDeals({
      categories: _categories,
      filters: {
        ...filters,
        page: +getQueryParams("page", history.location.search) || 1,
      },
    });
    _getUnavailableDeals({
      categories: _categories,
      filters: {
        ...filters,
        page: +getQueryParams("unavailable_page", history.location.search) || 1,
        page_size: 10,
      },
    });
  };
  useEffect(reload, [
    filters,
    `${history.location.pathname}${history.location.search}`,
  ]);
  return <iframe src={`${business.get_vitrin_absolute_admin_url}/s/settings/products?token=${axios.defaults.headers.common.Authorization.replace("Token ", "")}&no_layout=true`} className="w-100 h-100"></iframe>

}

const mapStateToProps = createStructuredSelector({
  business: makeSelectBusiness(),
  address: makeSelectBusinessAddress(),
  categories: makeSelectCategories(),
  deals: makeSelectFilteredDeals(),
  unavailableDeals: makeSelectUnavailableDeals(),
  pagination: makeSelectFilteredDealsPagination(),
  unavailableDealsPagination: makeSelectUnavailableDealsPagination(),
});

function mapDispatchToProps(dispatch) {
  return {
    _getDeals: (data) => dispatch(getDeals(data)),
    _getUnavailableDeals: (data) => dispatch(getUnavailableDeals(data)),
    _updateProduct: (productId, product, uploadedFiles,  callback) =>
      dispatch(
        updateProduct(productId, product, uploadedFiles, callback)
      ),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(memo, withRouter, withConnect)(Products);
