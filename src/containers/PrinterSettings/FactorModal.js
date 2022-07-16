import React, { memo } from "react";
import PropTypes from "prop-types";
import Modal from "../../components/Modal";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
import ComponentToPrint from "../../components/ComponentToPrint";
import CheckBox from "../../components/CheckBox";
const options = [
  {
    id: 1,
    title: "اطلاعات کسب‌وکار شما",
    sections: [
      { id: 1, text: "عنوان کسب‌و‌کار", field: "hideTitle" },
      { id: 2, text: "کد واکنش سریع (code QR)", field: "hideQR" },
      { id: 3, text: "شماره تماس کسب‌و‌کار", field: "hidePhone" },
    ],
  },
  {
    id: 2,
    title: "اطلاعات مشتری",
    sections: [
      { id: 4, text: "نام مشتری", field: "hideCustomerName" },
      { id: 5, text: "شماره سفارش", field: "hideOrderNumber" },
      { id: 6, text: "آدرس سفارش‌دهنده", field: "hideCustomerAddress" },
      { id: 7, text: "تلفن", field: "hideCustomerPhone" },
    ],
  },
  {
    id: 3,
    title: "اطلاعات سفارش",
    sections: [
      { id: 8, text: "جزئیات ارسال", field: "hideDetails" },
      { id: 9, text: "جزئیات آیتم‌های سفارش", field: "hideItems" },
      { id: 10, text: "مبالغ پرداختی", field: "hidePrices" },
      { id: 11, text: "مبالغ آیتم‌های سفارش", field: "hideItemPrices" },
    ],
  },
];
function FactorModal({ save, _onClose, business, printOptions, index }) {
  const printerOptions =
    index !== -1
      ? printOptions.printers[index]
      : {
          factor: {
            hideTitle: false,
            hideQR: false,
            hidePhone: false,
            hideCustomerName: false,
            hideOrderNumber: false,
            hideCustomerAddress: false,
            hideCustomerPhone: false,
            hideDetails: false,
            hideItems: false,
            hidePrices: false,
            hideItemPrices: false,
          },
        };
  return (
    <Modal isOpen={index !== -1} onClose={_onClose}>
      <div
        className="u-relative u-background-white c-modal-box"
        style={{ width: 660 }}
      >
        <Icon
          onClick={_onClose}
          size={25}
          icon={ICONS.CLOSE}
          color="#ccd4d7"
          className="u-cursor-pointer u-absolute u-top-0 right-0 m-3"
        />

        <div className="d-flex p-5 flex-1 u-mt-50 py-3 u-border-top-5">
          <div className="flex-1">
            {options.map((s) => (
              <div key={`section-${s.id}`} className="mb-5">
                <div className="u-text-black u-fontWeightBold mb-3">
                  {s.title}
                </div>
                {s.sections.map((o) => (
                  <CheckBox
                    text={o.text}
                    key={`option-${o.id}`}
                    className={`u-text-black u-fontMedium mt-2 ${o.className}`}
                    checked={!printerOptions.factor[o.field]}
                    onChange={(checked) => {
                      let newPrinters = [...printOptions.printers];
                      newPrinters[index] = {
                        ...newPrinters[index],
                        factor: {
                          ...printerOptions.factor,
                          [o.field]: !checked,
                        },
                      };
                      save({
                        printers: newPrinters,
                      });
                    }}
                    label={`defaultCheck${o.id}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div
            className="u-border-radius-8 overflow-hidden d-flex justify-content-center"
            style={{ boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)" }}
          >
            <ComponentToPrint
              printOptions={printerOptions.factor}
              size={printerOptions.size}
              order={{
                user_address: {},
                items: [
                  { deal: { title: "محصول ۱" } },
                  { deal: { title: "محصول ۲" } },
                ],
              }}
              business={business}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

FactorModal.propTypes = {
  _onClose: PropTypes.func,
  accept: PropTypes.func,
  print: PropTypes.func,
};
export default memo(FactorModal);
