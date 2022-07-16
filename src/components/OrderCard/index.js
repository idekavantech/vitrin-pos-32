import React, { memo } from "react";
import moment from "moment-jalaali";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  ellipseText,
  englishNumberToPersianNumber,
  noOp,
  priceFormatter,
} from "../../../utils/helper";
import Icon from "../Icon";
import { ICONS } from "../../../assets/images/icons";
import CheckBox from "../CheckBox";

function OrderCard({
  order,
  link,
  isBold,
  hasCheck,
  selected,
  onSelect,
  businessTitle,
}) {
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
  const nowDate = new Date();
  const backgroundColor =
    (orderStatus === 0 && "#0050FF") ||
    (orderStatus === 2 && "#ff0038") ||
    "#00c896";
  return (
    <>
      <Link
        to={link}
        onClick={(e) => {
          if (hasCheck) {
            e.preventDefault();
            onSelect(selected);
          }
        }}
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
            !isBold
              ? "u-background-melo-grey u-text-darkest-grey"
              : "u-background-white u-fontWeightBold u-text-black"
          }  pl-2`}
        >
          {hasCheck && (
            <CheckBox
              checked={selected}
              onChange={noOp}
              label={`defaultCheck${order.id}`}
              className="mr-2"
            />
          )}
          <div
            className="d-flex px-2 align-items-center justify-content-center"
            style={{ width: 90 }}
          >
            {orderDate.getMonth() === nowDate.getMonth() &&
            orderDate.getFullYear() === nowDate.getFullYear() &&
            orderDate.getDate() === nowDate.getDate() ? (
              <span>
                {englishNumberToPersianNumber(
                  `${`0${orderDate.getHours()}`.slice(
                    -2
                  )}:${`0${orderDate.getMinutes()}`.slice(-2)}`
                )}
              </span>
            ) : (
              <span>
                {englishNumberToPersianNumber(
                  orderTime.format("jYYYY/jMM/jDD")
                )}
              </span>
            )}
          </div>

          <span className="px-2" style={{ width: 75 }}>
            {ellipseText(englishNumberToPersianNumber(order.order_id), 8)}
          </span>
          <span className="u-text-ellipse px-2" style={{ width: 114 }}>
            {ellipseText(userAddress && userAddress.name, 18)}
          </span>

          {userAddress ? (
            <span
              className="u-text-ellipse mx-2 text-right flex-1 position-relative"
              style={{ width: 500 }}
            >
              {deliveryOnSite
                ? `تحویل در محل ${businessTitle}`
                : userAddress.address}
            </span>
          ) : null}
          {order.total_price === 0 ? (
            <div className="d-flex" style={{ width: 35 }}>
              <span className="u-text-green mr-1">اعتبار هدیه</span>
            </div>
          ) : (
            <>
              {paymentStatus === 1 && (
                <span className="mr-1 text-right" style={{ width: 40 }}>
                  آنلاین
                </span>
              )}
              {paymentStatus === 2 && (
                <span className="mr-1 text-right" style={{ width: 40 }}>
                  نقدی
                </span>
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
          <div style={{ width: 30 }}>
            {order.delivery_companies_data?.company_type && (
              <Icon icon={ICONS.DELIVERY} size={18} color="#00c896" />
            )}
          </div>
        </div>
      </Link>
    </>
  );
}

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};

export default memo(OrderCard);
