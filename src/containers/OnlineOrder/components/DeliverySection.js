import React from "react";
import Map from "../../../components/Map";
import {
  copyToClipboard,
  deliveryTimeFormatter,
  englishNumberToPersianNumber,
} from "../../../../utils/helper";
import moment from "moment-jalaali";

function DeliverySection({ order, business }) {
  const mapOptions = {
    height: 150,
    width: 150,
    center: {
      longitude: order.user_address ? order.user_address.longitude : null,
      latitude: order.user_address ? order.user_address.latitude : null,
    },
    markers: [
      {
        longitude: order.user_address ? order.user_address.longitude : null,
        latitude: order.user_address ? order.user_address.latitude : null,
        singleMarker: true,
      },
    ],
    style: {
      margin: 0,
    },
  };
  const timeOffset = new Date().getTimezoneOffset() === -270 ? -3600000 : 0;

  const orderDate = new Date(order.submitted_at + timeOffset);
  const orderTime = moment(
    `${orderDate.getFullYear()}-${
      orderDate.getMonth() + 1
    }-${orderDate.getDate()}`,
    "YYYY-MM-DD"
  );
  const pelateChar = order?.user_address?.extra_data?.plate_number?.replace(
    /[0-9]/g,
    ""
  );
  const plateNums = order?.user_address?.extra_data?.plate_number?.replace(
    pelateChar,
    ""
  );

  return (
    <div className="w-100 flex-1 py-2 u-background-white mt-1 px-3">
      <div className="flex-1 u-fontWeightBold mb-2 u-text-black">
        جزئیات ارسال
      </div>
      <div className="d-flex justify-content-between flex-wrap px-3">
        <div className="ml-4 mb-2" style={{ maxWidth: "70%" }}>
          <div className="mt-1">
            <span className="u-textBlack">ساعت و تاریخ: </span>
            <span className="d-inline-flex align-items-center">
              <span>
                {englishNumberToPersianNumber(
                  `${`0${orderDate.getHours()}`.slice(
                    -2
                  )}:${`0${orderDate.getMinutes()}`.slice(-2)}`
                )}
              </span>
              <div
                style={{ width: 2, height: 15 }}
                className="mx-2 u-background-dark-grey"
              />
              <span>
                {englishNumberToPersianNumber(
                  orderTime.format("jYYYY/jMM/jDD")
                )}
              </span>
            </span>
          </div>
          <div className="mt-2">
            <span className="u-textBlack">شماره تماس: </span>
            {order.user_address && (
              <span
                className="u-text-darkest-grey"
                onDoubleClick={copyToClipboard}
              >
                {englishNumberToPersianNumber(order.user_address.phone)}
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="u-textBlack"> نام سفارش دهنده: </span>
            {order.user_address && (
              <span
                onDoubleClick={copyToClipboard}
                className="u-text-darkest-grey"
              >
                {order.user_address.name}
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="u-textBlack"> آدرس سفارش دهنده: </span>
            {order.delivery_on_site ? (
              <span className="u-text-darkest-grey">
                {order.delivery_site_type === "delivery_on_car"
                  ? "تحویل در ماشین"
                  : `تحویل در محل ${business.revised_title}`}
              </span>
            ) : null}
            {order.user_address && !order.delivery_on_site ? (
              <span
                className="u-text-darkest-grey"
                onDoubleClick={copyToClipboard}
              >
                {order.user_address.address}
              </span>
            ) : null}
          </div>
          {order.delivery_interval ? (
            <div className="mt-2">
              <span className="u-textBlack">زمان ارسال: </span>
              <span className="mr-1" onDoubleClick={copyToClipboard}>
                {deliveryTimeFormatter(order.delivery_interval)}
              </span>
            </div>
          ) : null}
          <div className="mt-2">
            <span
              className={`u-textBlack ${
                order.delivery_on_site ? "u-fontWeightBold" : ""
              }`}
            >
              {order.delivery_on_site
                ? order.is_carry_out_order
                  ? "سفارش بیرون بر - بسته‌بندی شود."
                  : "میل در سالن"
                : null}
            </span>
          </div>
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
                    <div className="text-nowrap col-sm-3">
                      مدل: {order?.user_address?.extra_data?.model_name}
                    </div>
                  )}
                  {order?.user_address?.extra_data?.color && (
                    <div className="col-sm-4">
                      رنگ:{order?.user_address?.extra_data?.color}
                    </div>
                  )}
                  {order?.user_address?.extra_data?.plate_number && (
                    <div className="d-flex align-items-center col-sm-5 mb-3">
                      <span className="ml-1">پلاک: </span>
                      <div
                        className="d-flex"
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
        <Map options={mapOptions} />
      </div>
    </div>
  );
}

export default DeliverySection;
