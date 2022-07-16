import React, { memo, useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import bg1 from "../../../assets/images/login-bg-1.png";
import bg2 from "../../../assets/images/login-bg-2.png";
import logo from "../../../assets/images/vitrin-blue.png";
import { PrimaryButton } from "../../components/Button";
import {
  englishNumberToPersianNumber,
  persianToEnglishNumber,
  validatePhone,
} from "../../../utils/helper";
import { compose } from "redux";
import { login, verify } from "../../../stores/user/actions";
import { createStructuredSelector } from "reselect";
import { makeSelectLoading } from "../App/selectors";
import Input from "../../components/Input";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";

function Login({ _login, loading, _verify, history }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const codeRef = useRef(null);

  return (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <div
        className="d-flex container flex-1 justify-content-around align-items-center u-background-white position-relative h-100 u-border-radius-8 box-shadow"
        style={{ maxHeight: 489 }}>
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ width: "45%", maxWidth: 400 }}>
          <img className="" src={logo} style={{ height: 85, width: 220 }} />
          <div className="u-text-black u-fontWeightBold u-fontVeryLarge mt-5 text-center">
            به نرم‌افزار مدیریت فروش ویترین خوش آمدید.
          </div>
          <div className="mt-3 text-center u-text-black">
            برای ورود شماره تماس و کد تایید پیامک شده به موبایل خود را وارد کنید.
          </div>
        </div>
        <div
          className="d-flex flex-column justify-content-center position-relative"
          style={{ width: "45%", maxWidth: 400 }}>
          {loading && (
            <Icon
              styles={{ top: 25 }}
              icon={ICONS.SPINNER}
              size={24}
              color="#0050FF"
              className="position-absolute z-index-2 spinning"
            />
          )}
          <Input
            autoFocus
            className="u-border-bottom-dark-grey w-100 direction-ltr"
            style={{ textAlign: "center" }}
            placeholder="۰۹** *** ****"
            // type="tel"
            onChange={(value) => {
              const number = persianToEnglishNumber(value.slice(0, 11));
              setPhoneError("");
              if (number.length > 10)
                if (!validatePhone(number)) setPhoneError("شماره تلفن را به درستی وارد کنید.");
                else {
                  codeRef.current.focus();
                  _login(number);
                }
              setPhone(number);
            }}
            value={phone ? englishNumberToPersianNumber(phone) : ""}
          />
          <div className="u-text-red text-right mt-2">{phoneError}</div>
          <Input
            onKeyUp={(e) => {
              if (e.keyCode === 13 && code.length === 4 && validatePhone(phone))
                _verify(phone, code, history);
            }}
            inputRef={codeRef}
            className="u-border-bottom-dark-grey w-100 text-center"
            id="otp"
            maxLength="4"
            style={{ textAlign: "center" }}
            placeholder="...."
            value={code ? englishNumberToPersianNumber(code) : ""}
            onChange={(value) => setCode(persianToEnglishNumber(value))}
          />
          <PrimaryButton
            isLoading={loading}
            text="تایید و ادامه"
            style={{ marginTop: 60 }}
            disabled={code.length !== 4 || !validatePhone(phone)}
            onClick={() => {
              _verify(phone, code, history);
            }}
          />

          <div className="d-flex justify-content-around u-font-semi-small mt-5">
            <div className="u-text-dark-grey">کدی دریافت نکردید؟</div>
            <div
              className="u-cursor-pointer u-text-primary-blue"
              onClick={() => {
                if (!validatePhone(phone)) setPhoneError("شماره تلفن را به درستی وارد کنید.");
                else _login(phone);
              }}>
              ارسال مجدد کد تایید
            </div>
          </div>
        </div>
        <img className="position-absolute right-0 u-top-0" src={bg1} />
        <img className="position-absolute left-0 bottom-0" src={bg2} />
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
});

export function mapDispatchToProps(dispatch) {
  return {
    _login: (phone) => dispatch(login(phone)),
    _verify: (phone, code, history) => dispatch(verify(phone, code, history)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRouter, withConnect, memo)(Login);
