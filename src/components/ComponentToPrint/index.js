import React from "react";
import PropTypes from "prop-types";
import {
  englishNumberToPersianNumber,
  priceFormatter,
} from "../../../utils/helper";
import moment from "moment-jalaali";
import QRCode from "qrcode.react";

export default class ComponentToPrint extends React.Component {
  render() {
    const { order, business, printOptions = {}, size } = this.props;
    const isLarge = size === "۸ سانتی‌متری";
    let cost = "رایگان";
    if (+order.delivery_price === 999999) cost = "خارج از محدوده ارسال";
    else if (+order.delivery_price !== 0)
      cost = ` ${priceFormatter(+order.delivery_price)} تومان `;
    const {
      revised_title: title,
      get_vitrin_absolute_url: url,
      phone_zero_starts: phone,
    } = business;
    const timeOffset = new Date().getTimezoneOffset() === -270 ? -3600000 : 0;
    const date = moment(order.submitted_at + timeOffset).format(
      "jYYYY/jMM/jDD - HH:mm:ss"
    );
    const sortedItems = [...order.items];
    sortedItems.sort((a, b) => {
      let firstTotal = a.discounted_price;
      let secondTotal = b.discounted_price;
      if (a.modifiers)
        for (let i = 0; i < a.modifiers.length; i += 1)
          firstTotal += a.modifiers[i].price;
      if (b.modifiers)
        for (let j = 0; j < b.modifiers.length; j += 1)
          secondTotal += b.modifiers[j].price;
      if (firstTotal > secondTotal) return -1;
      if (firstTotal < secondTotal) return 1;
      return 0;
    });
    const pelateChar = order?.user_address?.extra_data?.plate_number?.replace(
      /[0-9]/g,
      ""
    );
    const plateNums = order?.user_address?.extra_data?.plate_number?.replace(
      pelateChar,
      ""
    );
    const finalCost = order.should_pay;
    const getHowOrderIsPaidText = () => {
      if (finalCost > 0 && order.paid_price === 0) return "نقدی دریافت شود"; // چیزی پرداخت نکرده
      if (finalCost === 0 && order.paid_price === order.total_price)
        // کامل پرداخت کرده
        return "آنلاین پرداخت شد";
      if (finalCost > 0) return `${priceFormatter(finalCost)} دریافت شود`; // یه مبلغی باقی مانده
      if (finalCost < 0) return `${priceFormatter(finalCost)} عودت داده شود`; // مبلغی باید عودت داده بشه
    };
    const { hasNoBlackBackground } = printOptions;
    return (
      <div
        className="bg-white u-text-black w-100 printable px-3 py-1"
        style={{
          width: isLarge ? "100%" : "calc(100% - 60px)",
          marginRight: isLarge ? 0 : 30,
          minWidth: 300,
          fontSize: isLarge ? 14 : 12,
          ...(printOptions.hasNoBorders ? { border: "1px solid #000" } : {}),
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
         
                .factor-table td, .factor-table th {
                  padding: 2px;
                }
                .factor-table tfoot td {
                  border-top: 1px solid #000; 
                }
        `,
          }}
        />
        <div className="py-1 px-2 u-border-bottom-dark">
          <div className="d-flex justify-content-between align-items-center">
            <span
              className="d-flex px-1 py-2 flex-column justify-content-center align-items-center"
              style={{
                border: "1px solid black",
                height: "fit-content",
                borderRadius: 4,
              }}
            >
              <span
                className="text-center"
                style={{ fontSize: isLarge ? 12 : 10, whiteSpace: "nowrap" }}
              >
                شماره فاکتور
              </span>
              <span
                style={{ fontSize: isLarge ? 18 : 16 }}
                className="u-fontWeightBold"
              >
                {englishNumberToPersianNumber(order.order_number) || "۱۰۱"}
              </span>
            </span>
            {!printOptions.hideTitle && (
              <div
                className="text-center u-fontWeightBold"
                style={{ width: 160, fontSize: isLarge ? 18 : 16 }}
              >
                {title}
              </div>
            )}
            {!printOptions.hideQR && <QRCode value={url} size={100} id="qr" />}
          </div>
        </div>
        <div className="d-flex flex-column justify-content-between px-3 pb-1">
          <div className="mt-1">
            <span>تاریخ و ساعت: </span>
            <span className="u-fontWeightBold">
              {englishNumberToPersianNumber(date)}
            </span>
          </div>
          {!printOptions.hideOrderNumber && (
            <div className="mt-1">
              <span>شماره سفارش: </span>
              <span className="u-fontWeightBold">{order.order_id}</span>
            </div>
          )}

          {!printOptions.hideCustomerName && (
            <div className="mt-1">
              <span> مشترک گرامی: </span>
              {order.user_address && (
                <span className="u-fontWeightBold">
                  {order.user_address.name || order.user_name}
                </span>
              )}
            </div>
          )}
          {!printOptions.hideCustomerPhone && (
            <div className="mt-1">
              <span>موبایل: </span>
              {order.user_address && (
                <span className="u-fontWeightBold">
                  {order.user_address.phone}
                </span>
              )}
            </div>
          )}

          {!printOptions.hideCustomerAddress && (
            <div className="mt-1">
              <span> آدرس سفارش دهنده: </span>
              {order.delivery_on_site ? (
                <span className="u-fontWeightBold">
                  {order.delivery_site_type === "delivery_on_car"
                    ? "تحویل در ماشین"
                    : `تحویل در محل ${business.revised_title}`}
                </span>
              ) : null}
              {order.user_address && !order.delivery_on_site ? (
                <span className="u-fontWeightBold">
                  {order.user_address.address}
                </span>
              ) : null}
            </div>
          )}

          {!printOptions.hideDetails && (
            <div className="mt-1">
              <span>جزئیات ارسال: </span>
              <span
                className="u-fontWeightBold"
                style={{ whiteSpace: "pre-wrap", fontSize: isLarge ? 17 : 15 }}
              >
                {(order && order.description) || "ندارد"}
              </span>
            </div>
          )}
          {order.delivery_on_site ? (
            <div className="mt-1">
              <span
                className="u-fontWeightBold"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {order.is_carry_out_order
                  ? "سفارش بیرون بر - بسته‌بندی شود."
                  : "میل در سالن"}
              </span>
            </div>
          ) : null}
          {order?.delivery_site_type?.toUpperCase() === "DELIVERY_ON_CAR" &&
            (order?.user_address?.extra_data?.model_name ||
              order?.user_address?.extra_data?.color ||
              order?.user_address?.extra_data?.plate_number) && (
              <div className="mt-3">
                <div className="u-textBlack" style={{ fontWeight: 500 }}>
                  اطلاعات خودرو
                </div>
                <div className="row d-flex align-items-center">
                  {order?.user_address?.extra_data?.model_name && (
                    <div className="text-nowrap">
                      مدل: {order?.user_address?.extra_data?.model_name}
                    </div>
                  )}
                  {order?.user_address?.extra_data?.color && (
                    <div className="mr-4">
                      رنگ: {order?.user_address?.extra_data?.color}
                    </div>
                  )}
                  {order?.user_address?.extra_data?.plate_number && (
                    <div className="d-flex align-items-center mr-4 mb-3">
                      <span>پلاک: </span>
                      <div
                        className="d-flex mx-1"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <div
                          className="d-flex justify-content-center py-1 px-3 position-relative"
                          style={{
                            border: "1px solid gray",
                          }}
                        >
                          <span
                            className="position-absolute"
                            style={{ top: 0 }}
                          >
                            ایران
                          </span>
                          <span className="ml-2 pt-3">
                            {plateNums?.slice(5)}
                          </span>
                        </div>
                        <div
                          className="py-1 pt-3 px-3"
                          style={{
                            border: "1px solid gray",
                          }}
                        >
                          <span className="ml-2">{plateNums?.slice(2, 5)}</span>
                          <span className="ml-2">{pelateChar}</span>
                          <span>{plateNums?.slice(0, 2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>

        {!printOptions.hideItems && (
          <div
            className="factor-table my-1"
            style={{
              borderTop: "1px solid #000",
              borderBottom: "1px solid #000",
            }}
          >
            <div
              className={`d-flex flex-row ${
                hasNoBlackBackground ? "u-background-black u-text-white" : ""
              }`}
            >
              <div
                style={{
                  width: !printOptions.hideItemPrices ? 160 : 320,
                  whiteSpace: "pre-wrap",
                }}
              >
                نام
              </div>
              {!printOptions.hideItemPrices && (
                <div className="text-center" style={{ width: 80 }}>
                  فی
                </div>
              )}
              <div className="text-center" style={{ width: 35 }}>
                تعداد
              </div>
              {!printOptions.hideItemPrices && (
                <div className="text-center" style={{ width: 80 }}>
                  قیمت کل
                </div>
              )}
            </div>

            {sortedItems.map((item) => (
              <React.Fragment key={item.id}>
                <div
                  className="d-flex flex-row"
                  style={{ borderTop: "1px solid #000" }}
                >
                  <div
                    style={{
                      fontSize: isLarge ? 16 : 14,
                      width: !printOptions.hideItemPrices ? 160 : 320,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.product_title}{" "}
                    {item.variation_title !== item.product_title &&
                      `(${item.variation_title})`}
                  </div>
                  {!printOptions.hideItemPrices && (
                    <div className="text-center" style={{ width: 80 }}>
                      {priceFormatter(item.discounted_price)}
                    </div>
                  )}
                  <div
                    className="text-center"
                    style={{ fontSize: isLarge ? 18 : 16, width: 35 }}
                  >
                    {englishNumberToPersianNumber(item.amount)}
                  </div>
                  {!printOptions.hideItemPrices && (
                    <div className="text-center" style={{ width: 80 }}>
                      {priceFormatter(item.discounted_price * item.amount)}
                    </div>
                  )}
                </div>
                {item.modifiers && item.modifiers.length
                  ? item.modifiers.map((_item) => (
                      <div
                        className="d-flex flex-row"
                        key={`order-item-${_item.id}`}
                        style={{ fontSize: isLarge ? 14 : 12 }}
                      >
                        <div
                          style={{
                            width: !printOptions.hideItemPrices ? 160 : 320,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {_item.modifier_title}
                        </div>
                        {!printOptions.hideItemPrices && (
                          <>
                            <div className="text-center" style={{ width: 80 }}>
                              {priceFormatter(_item.discounted_price)}
                            </div>
                          </>
                        )}
                        <div className="text-center" style={{ width: 35 }}>
                          {englishNumberToPersianNumber(item.amount)}
                        </div>
                        {!printOptions.hideItemPrices && (
                          <>
                            <div className="text-center" style={{ width: 80 }}>
                              {priceFormatter(
                                _item.discounted_price * item.amount
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  : null}
              </React.Fragment>
            ))}

            {!printOptions.hideItemPrices && (
              <div
                className="d-flex flex-row"
                style={{ borderTop: "1px solid #000" }}
              >
                <div
                  className="text-right"
                  style={{
                    width: !printOptions.hideItemPrices ? 275 : 435,
                    whiteSpace: "pre-wrap",
                    fontSize: isLarge ? 16 : 14,
                  }}
                >
                  جمع
                </div>
                <div
                  className="text-center"
                  style={{ width: 80, fontSize: isLarge ? 16 : 14 }}
                >
                  {priceFormatter(order.total_items_discounted_price)}
                </div>
              </div>
            )}
          </div>
        )}

        {!printOptions.hidePrices && (
          <div className="d-flex flex-column justify-content-between pl-3 pb-1 u-border-bottom-dark">
            <div className="mt-1 d-flex justify-content-between">
              <span>قیمت اولیه: </span>
              <span
                className="u-fontWeightBold"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {priceFormatter(order.total_items_initial_price)} تومان
              </span>
            </div>
            {order.total_discount_amount ? (
              <div className="mt-1  d-flex justify-content-between">
                <span>مجموع تخفیف‌ها: </span>
                <span
                  className="u-fontWeightBold"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {priceFormatter(order.total_discount_amount)}
                  <span className="mx-1">-</span>
                  <span>تومان</span>
                </span>
              </div>
            ) : null}
            {order.gift_credit_used &&
            order.total_discount_amount !== order.gift_credit_used ? (
              <div className="mt-1 d-flex justify-content-between">
                <span>اعتبار هدیه: </span>
                <span
                  className="u-fontWeightBold"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {priceFormatter(order.gift_credit_used)}
                  <span className="mx-1">-</span>
                  <span>تومان</span>
                </span>
              </div>
            ) : null}
            {order.discount_code_amount &&
            order.discount_code_amount !== order.total_discount_amount ? (
              <div className="mt-1 d-flex justify-content-between">
                <span>کد تخفیف: </span>
                <span
                  className="u-fontWeightBold"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {priceFormatter(order.discount_code_amount)}
                  <span className="mx-1">-</span>
                  <span>تومان</span>
                </span>
              </div>
            ) : null}

            {order.taxing_price ? (
              <div className="mt-1 d-flex justify-content-between">
                <span>مالیات بر ارزش افزوده: </span>
                <span
                  className="u-fontWeightBold"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {priceFormatter(order.taxing_price)} تومان
                </span>
              </div>
            ) : null}
            <div className="mt-1 d-flex justify-content-between">
              <span>هزینه ارسال: </span>
              <span className="u-fontWeightBold">{cost}</span>
            </div>
            {order.total_packaging_price ? (
              <div className="mt-1 d-flex justify-content-between">
                <span>هزینه بسته‌بندی: </span>
                <span
                  className="u-fontWeightBold"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {priceFormatter(order.total_packaging_price)} تومان
                </span>
              </div>
            ) : null}

            <div
              style={{ margin: "10px 0" }}
              className="d-flex justify-content-center align-items-center"
            >
              <span className={"u-fontWeightBold"}>قابل پرداخت</span>
              <span
                className={`u-fontWeightBold px-3 py-1 ${
                  hasNoBlackBackground ? "u-background-black u-text-white" : ""
                }`}
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: isLarge ? 18 : 16,
                }}
              >
                {priceFormatter(order.total_price)} تومان
              </span>
            </div>
            <div className="mt-1 d-flex justify-content-center">
              <span
                className="u-fontWeightBold py-1 u-fontVeryLarge"
                style={{ whiteSpace: "pre-wrap", fontSize: isLarge ? 18 : 16 }}
              >
                {getHowOrderIsPaidText()}
              </span>
            </div>
          </div>
        )}

        {!printOptions.hidePhone && (
          <div className="mt-1 px-3 text-center">
            <span>{title}: </span>
            <span className="u-fontWeightBold">{phone}</span>
          </div>
        )}
        <div className="mt-1 px-3 text-center">
          <span>{url}</span>
        </div>
      </div>
    );
  }
}
ComponentToPrint.propTypes = {
  order: PropTypes.object.isRequired,
  business: PropTypes.object.isRequired,
};
