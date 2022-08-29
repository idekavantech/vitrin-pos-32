/**
 *
 * ProductCard
 *
 */

import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ProductPrice from "./ProductPrice";
import { CDN_BASE_URL } from "../../../utils/api";
import {
  calculateDiscountPercent,
  ellipseText,
  englishNumberToPersianNumber,
  noOp,
  persianToEnglishNumber,
  priceFormatter,
} from "../../../utils/helper";
import Switch from "../Swtich";
import pen from "../../../assets/images/pen.svg";
import Input from "../Input";

function ProductCard({
  product,
  _updateProduct = noOp,
  loading,
}) {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const {
    title,
    initial_price: initialPrice,
    discounted_price: discountedPrice,
    main_image_thumbnail_url: mainImageThumbnailUrl,
    inventory_count: inventoryCount,
  } = updatedProduct;
  const submit = (p) => {
    if (!loading && product.id) {
      _updateProduct(product.id, p || updatedProduct, null);
    }
  };
  useEffect(() => {
    setUpdatedProduct({ ...product.default_variation });
  }, [product.id]);

    return (
      <div className="d-flex text-center align-items-center mt-1 flex-1 mx-1 my-2">
        <div
          className="col-2 px-0 d-flex align-items-center "
        >
          <div className="col-2 px-0">
            <img
              className="u-height-36 width-36 u-border-radius-4 u-background-melo-grey"
              style={{ boxShadow: " inset 0px 0px 4px rgba(0, 0, 0, 0.1)" }}
              alt={`image-${product.id}`}
              src={mainImageThumbnailUrl}
            />
          </div>
          <div
            className="d-flex align-items-center col-10 pl-0 text-right pr-3"
            style={{ minHeight: 48 }}
          >
            {title}
          </div>
        </div>
        <div className="col-8 px-0 d-flex align-items-center">
          <div className="col-3 px-0">
            <Input
              editOnDoubleClick
              style={{ textAlign: "center" }}
              variant="standard"
              onChange={(price) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  initial_price: price
                    ? parseInt(persianToEnglishNumber(price))
                    : 0,
                  discounted_price: price
                    ? parseInt(persianToEnglishNumber(price))
                    : 0,
                })
              }
              onBlur={() => {
                if (initialPrice !== product.default_variation.initial_price) submit();
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && initialPrice !== product.default_variation.initial_price) {
                  event.target.blur();
                  submit();
                }
              }}
              numberOnly
              value={englishNumberToPersianNumber(initialPrice)}
            />
          </div>
          <div className="col-3 px-0">
            <Input
              editOnDoubleClick
              style={{ textAlign: "center" }}
              variant="standard"
              onChange={(discountAmount) => {
                if(persianToEnglishNumber(discountAmount) <= initialPrice)
                setUpdatedProduct({
                  ...updatedProduct,
                  discounted_price:
                    initialPrice - persianToEnglishNumber(discountAmount)
                });
              }
              }
              onBlur={() => {
                if (discountedPrice !== product.default_variation.discounted_price) submit();
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && discountedPrice !== product.default_variation.discounted_price) {
                  event.target.blur();
                  submit();
                }
              }}
              numberOnly
              value={englishNumberToPersianNumber(
                initialPrice - discountedPrice
              )}
            />
          </div>
          <div className="col-2 px-0 u-fontMedium">
            <Input
              editOnDoubleClick
              style={{ textAlign: "center" }}
              variant="standard"
              onChange={(value) => {
                if (value <= 100)
                  setUpdatedProduct({
                    ...updatedProduct,
                    discounted_price:
                      initialPrice * (1 - persianToEnglishNumber(value) / 100)
                  });
              }
              }
              onBlur={() => {
                if (discountedPrice !== product.default_variation.discounted_price) submit();
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && discountedPrice !== product.default_variation.discounted_price) {
                  event.target.blur();
                  submit();
                }
              }}
              numberOnly
              value={englishNumberToPersianNumber(
                calculateDiscountPercent(initialPrice, discountedPrice)
              )}
            />
          </div>
          <div className="col-3 px-0">
            <span>{priceFormatter(Math.round(discountedPrice))}</span>
          </div>
          <div className="col-1 px-0">
            <span>
              {inventoryCount || inventoryCount === 0
                ? englishNumberToPersianNumber(inventoryCount)
                : ""}
            </span>
          </div>
        </div>
        <div className="col-2 px-0 d-flex">
          <div className="col-10 px-0">
            <div className="d-flex justify-content-center align-items-end flex-1">
              <span
                style={{ width: 40 }}
                className={`u-font-semi-small ml-2 u-fontWeightBold ${
                  updatedProduct.is_active
                    ? "u-text-primary-blue"
                    : "u-text-darkest-grey"
                }`}
              >
                {updatedProduct.is_active ? "فعال" : "غیرفعال"}
              </span>
              <Switch
                isSwitchOn={updatedProduct.is_active}
                toggleSwitch={(is_active) => {
                  setUpdatedProduct({
                    ...updatedProduct,
                    is_active,
                  });
                  submit({
                    ...updatedProduct,
                    is_active,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );

}

ProductCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  increaseOrderItem: PropTypes.func,
  decreaseOrderItem: PropTypes.func,
  product: PropTypes.object,
  hasOrderControlPanel: PropTypes.bool,
  themeColor: PropTypes.string,
};

export default memo(ProductCard);
