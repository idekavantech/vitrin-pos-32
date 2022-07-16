import React, { useState } from "react";
import PropTypes from "prop-types";
import Collapse from "@material-ui/core/Collapse";
import useTheme from "@material-ui/core/styles/useTheme";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";

import {
  englishNumberToPersianNumber,
  persianToEnglishNumber,
} from "../../../utils/helper";
import InputAdornment from "@material-ui/core/InputAdornment";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import IconButton from "@material-ui/core/IconButton";
import Input from "../../components/Input";

export default function PopularitySection({ product, setProduct }) {
  const { priority } = product;
  const [collapse, setCollapse] = useState(parseInt(priority, 10) !== 100);
  const theme = useTheme();
  return (
    <Paper className="my-3 px-3 pt-2 pb-3">
      <div className="d-flex align-items-center">
        <Checkbox
          color="primary"
          checked={collapse}
          onChange={(e) => {
            setCollapse(e.target.checked);
            if (!e.target.checked) {
              setProduct({
                ...product,
                priority: 100,
              });
            }
          }}
        />
        <Box className="u-fontLarge" color={theme.palette.text.tertiary}>
          اولویت (محبوبیت)
        </Box>
      </div>
      <Collapse in={collapse}>
        <Box color="text.disabled" className="u-fontNormal mt-1 px-3">
          چنانچه می‌خواهید ترتیب این محصول را برحسب اولویت نمایش در سایت مشخص
          کنید به آن امتیاز دهید. (حالت پیشفرض همه محصولات عدد ۱۰۰ است){" "}
        </Box>
        <div className="position-relative mt-3 col-md-6 col-12">
          <Input
            size="medium"
            numberOnly
            value={englishNumberToPersianNumber(parseInt(priority, 10))}
            onChange={(value) => {
              setProduct({
                ...product,
                priority: persianToEnglishNumber(value) || 0,
              });
            }}
            label="اولویت"
            InputProps={{
              endAdornment: (
                <InputAdornment
                  style={{ position: "absolute", left: 3 }}
                  position="start"
                >
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ width: 18, height: 18 }}
                  >
                    <IconButton
                      className="p-1"
                      onClick={() => {
                        const number = parseInt(priority, 10) + 1;
                        setProduct({ ...product, priority: number });
                      }}
                    >
                      <KeyboardArrowUpIcon
                        className="u-cursor-pointer"
                        style={{ fontSize: 12 }}
                      />
                    </IconButton>
                    <IconButton
                      className="p-1"
                      onClick={() => {
                        const number = parseInt(priority, 10) - 1;
                        if (number >= 0)
                          setProduct({ ...product, priority: number });
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className="u-cursor-pointer"
                        style={{ fontSize: 12 }}
                      />
                    </IconButton>
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Collapse>
    </Paper>
  );
}

PopularitySection.propTypes = {
  setProduct: PropTypes.func,
  product: PropTypes.object,
};
