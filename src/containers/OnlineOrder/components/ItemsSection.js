import React from "react";
import {
  copyToClipboard,
  englishNumberToPersianNumber,
  priceFormatter,
} from "../../../../utils/helper";

function ItemsSection({ order }) {
  return (
    <div className="w-100 py-2 u-background-white px-3">
      <div className="flex-1 u-fontWeightBold mb-2 u-text-black">
        آیتم‌های سفارش
      </div>
      {order.items.map((item, index) => (
        <div
          className="d-flex flex-row justify-content-between mt-2 px-3"
          style={{
            alignItems:
              item.modifiers && item.modifiers.length
                ? "start"
                : "center",
          }}
          key={`item-${index}`}
        >
          <div className="wrapper--img-order">
            <img
              alt={item.product_title}
              className="w-100 h-100 object-fit"
              src={item.product_main_image_thumbnail_url || item.main_image_thumbnail_url} 
            />
          </div>
          <div className="flex-1 d-flex flex-column justify-content-center">
            <div
              onDoubleClick={copyToClipboard}
              className="u-fontNormal u-textBlack u-fontWeightBold"
            >
              {item.product_title}
            </div>
            <div
              onDoubleClick={copyToClipboard}
              className="u-fontVerySmall u-text-darkest-grey mt-1 overflow-hidden u-max-height-18"
              dangerouslySetInnerHTML={{
                __html: item.description,
              }}
            />
            {item.modifiers && item.modifiers.length ? (
              <ul
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ fontSize: 12 }}
              >
                {item.modifiers.map((_item, index) => (
                  <li
                    key={`modifier-${index}`}
                    className="d-flex justify-content-between align-items-center w-100"
                  >
                    <div className="u-fontVerySmall u-text-darkest-grey ">
                      - {_item.product_title}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {item.variation_name && (
            <div className="ml-2">{item.variation_name}</div>
          )}
          <div className="u-text-darkest-grey order--item u-border-medium-grey align-items-center u-no-wrap">
            <div>{englishNumberToPersianNumber(item.amount)}</div>
            عدد
          </div>
          <div
            className="u-no-wrap d-flex flex-column justify-content-center"
            style={{ width: 100 }}
          >
            {item.discounted_price !== item.initial_price && (
              <div className="u-fontSemiSmall u-text-darkest-grey u-text-line-through">
                {priceFormatter(item.initial_price)}
              </div>
            )}
            <div className="u-textBlack u-fontMedium">
              <span>
                {priceFormatter(item.discounted_price)}
                <span className="u-font-semi-small"> تومان</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemsSection;
