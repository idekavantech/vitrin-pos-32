/**
 *
 * CategoryPresentation
 *
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import ProductCard from "../ProductCard";
import CategoryHeader from "./CategoryHeader";
import AddNewProductCard from "../ProductCard/AddNewProductCard";
import { Link, withRouter } from "react-router-dom";
import Pagination from "../Pagination";

function CategoryPresentation({
  category: { deals: products, name, id },
  themeColor,
  productCardOptions,
  isEditMode,
  isList,
  pagination,
  history,
  backgroundColor = "white",
  keyword,
}) {
  return (
    <div className="mt-5 container-shadow container u-border-radius-8 overflow-hidden bg-white px-0">
      <div className="p-3 d-flex justify-content-between u-background-melo-grey">
        <div className="w-100">
          <CategoryHeader
            categoryName={name}
            themeColor={themeColor}
            isEditMode={isEditMode}
            isList={isList}
            categoryId={id}
          />
        </div>
      </div>
      <div
        className={`justify-content-start py-2 ${
          !isList && "d-flex flex-wrap py-5"
        }`}
        style={{ padding: !isList ? "0 50px" : "0 39px", backgroundColor }}
      >
        {isEditMode && !isList && (
          <Link to={`/products/new/${id}`}>
            <AddNewProductCard />
          </Link>
        )}
        {products.map((product) => (
          <ProductCard
            isList={isList}
            key={`c-${id}-p-${product.id}`}
            themeColor={themeColor}
            product={product}
            {...productCardOptions}
          />
        ))}
      </div>
      <Pagination
        pagination={pagination}
        location={history.location}
        keyword={keyword}
        style={{ backgroundColor }}
      />
    </div>
  );
}

CategoryPresentation.propTypes = {
  category: PropTypes.object,
  history: PropTypes.object,
  themeColor: PropTypes.string,
  productCardOptions: PropTypes.object,
  pluginBaseUrl: PropTypes.string,
  isEditMode: PropTypes.bool,
  showMoreBtnOnClick: PropTypes.func,
};

export default memo(withRouter(CategoryPresentation));
