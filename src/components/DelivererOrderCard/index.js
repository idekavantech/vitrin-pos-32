import React, { memo } from "react";
import moment from "moment-jalaali";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  ellipseText,
  englishNumberToPersianNumber,
  priceFormatter,
} from "../../../utils/helper";
import Icon from "../Icon";
import { ICONS } from "../../../assets/images/icons";

function DelivererOrderCard({ order, link }) {
  const {
    total_price: totalPrice,
    user_address: userAddress,
    submitted_at: createdAt,
    order_status: orderStatus,
    payment_status: paymentStatus,
    delivery_on_site: deliveryOnSite,
  } = order;
  const orderDate = new Date(createdAt);
  const orderTime = moment(
    `${orderDate.getFullYear()}-${
      orderDate.getMonth() + 1
    }-${orderDate.getDate()}`,
    "YYYY-MM-DD"
  );
  const backgroundColor =
    (orderStatus === 0 && "#0050FF") ||
    (orderStatus === 2 && "#ff0038") ||
    "#00c896";
  return (
    <>
      <Link
        to={link}
        className="d-flex px-0 u-cursor-pointer c-order-card overflow-hidden"
      >
        <div
          style={{
            minWidth: 4,
            backgroundColor,
          }}
        />
        <div
          className={`d-flex w-100 text-center py-1 ${
            order.order_status !== 0
              ? "u-background-melo-grey u-text-darkest-grey"
              : "u-background-white u-fontWeightBold u-text-black"
          }  pl-2`}
        >
          <div className="d-flex px-2 align-items-center">
            <span>
              {englishNumberToPersianNumber(orderTime.format("jYY/jM/jD"))}
            </span>
          </div>

          <span className="px-2" style={{ width: 75 }}>
            {ellipseText(englishNumberToPersianNumber(order.order_id), 8)}
          </span>

          <span className="u-text-ellipse px-2 flex-1 text-right">
            {deliveryOnSite ? "تحویل در محل رستوران" : userAddress.address}
          </span>
          {order.total_price === 0 ? (
            <div className="d-flex" style={{ width: 35 }}>
              <span className="u-text-green mr-1">اعتبار هدیه</span>
            </div>
          ) : (
            <>
              {paymentStatus === 1 && (
                <div className="d-flex" style={{ width: 35 }}>
                  <span className="u-text-green mr-1">آنلاین</span>
                </div>
              )}
              {paymentStatus === 2 && (
                <div className="d-flex" style={{ width: 35 }}>
                  <span className="u-text-red mr-1">نقدی</span>
                </div>
              )}
            </>
          )}

          <span
            className="px-2 u-no-wrap u-text-ellipse"
            style={{ width: 110 }}
          >
            {englishNumberToPersianNumber(priceFormatter(totalPrice))}
            <span className="u-font-semi-small"> تومان</span>
          </span>
        </div>
      </Link>
    </>
  );
}

DelivererOrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};

export default memo(DelivererOrderCard);
