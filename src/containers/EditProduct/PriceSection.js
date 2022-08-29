import React, { useState } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";

import {
  calculateDiscountPercent,
  englishNumberToPersianNumber,
  persianToEnglishNumber,
  priceFormatter,
  reversePriceFormatter,
} from "../../../utils/helper";
import useTheme from "@material-ui/core/styles/useTheme";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import IconButton from "@material-ui/core/IconButton";
import Input from "../../components/Input";
import TextSwitch from "../../components/TextSwitch";
import Select from "../../components/Select";
import {
  availableOnDayOptions,
  inventoryOptions,
} from "../../../stores/business/constants";

export default function PriceSection({ product, setProduct, hasVariation }) {
  const theme = useTheme();
  const [hasDiscount, setHasDiscount] = useState(
    product.initial_price > product.discounted_price
  );
  const [isPercent, setIsPercent] = useState(false);
  const {
    extra_data: {
      only_on_day: selectedDays = [],
      packaging_price: packagingPrice,
    },
    is_active,
    inventory_count: inventoryCount,
    initial_price: price,
    discounted_price: finalPrice,
  } = product;

  const addDay = (day) => {
    if (!selectedDays.find((sc) => sc.id === day.id)) {
      setProduct({
        ...product,
        extra_data: {
          ...product.extra_data,
          only_on_day: [...selectedDays, day],
        },
      });
    }
  };
  const removeDay = (day) => {
    const selectedDayIndex = selectedDays.findIndex((sc) => sc.id === day.id);
    const _selectedDays = [...selectedDays];
    _selectedDays.splice(selectedDayIndex, 1);
    if (selectedDayIndex > -1) {
      setProduct({
        ...product,
        extra_data: { ...product.extra_data, only_on_day: _selectedDays },
      });
    }
  };
  return (
    <Paper className="d-flex flex-wrap my-3 py-3">
      <div className="col-12 col-lg-6">
        <div className="flex-1 u-fontLarge">قیمت و موجودی محصول</div>

        <div className="d-flex mt-2 align-items-center">
          <Checkbox
            color="primary"
            checked={hasDiscount}
            onChange={(e) => {
              setHasDiscount(e.target.checked);
              setProduct({
                ...product,
                discounted_price: reversePriceFormatter(product.initial_price),
              });
            }}
          />
          <Box color={theme.palette.text.tertiary}>تخفیف روی محصول</Box>
        </div>

        <Input
          label="قیمت محصول (تومان)"
          value={price}
          size="medium"
          className="u-fontNormal mt-3"
          priceInput
          onChange={(value) => {
            setProduct({
              ...product,
              initial_price: reversePriceFormatter(value),
              discounted_price: reversePriceFormatter(value),
            });
          }}
        />
        <Collapse in={hasDiscount}>
          <div className="d-flex align-items-center mt-2">
            <div className="w-50">
              <Input
                size="medium"
                disabled={hasVariation}
                value={
                  isPercent
                    ? englishNumberToPersianNumber(
                        calculateDiscountPercent(
                          reversePriceFormatter(price),
                          finalPrice
                        ),
                        ""
                      )
                    : englishNumberToPersianNumber(
                        reversePriceFormatter(price) - finalPrice,
                        ""
                      )
                }
                className="u-height-36 u-fontNormal mt-3"
                priceInput={!isPercent}
                onChange={(value) => {
                  if (isPercent) {
                    if (persianToEnglishNumber(value) <= 100)
                      setProduct({
                        ...product,
                        discounted_price: Math.floor(
                          reversePriceFormatter(price) *
                            (1 - persianToEnglishNumber(value) / 100)
                        ),
                      });
                  } else {
                    if (
                      reversePriceFormatter(price) -
                        reversePriceFormatter(value) >
                      0
                    )
                      setProduct({
                        ...product,
                        discounted_price:
                          reversePriceFormatter(price) -
                          reversePriceFormatter(value),
                      });
                  }
                }}
                label={`تخفیف محصول (${isPercent ? "درصد" : "تومان"})`}
                numberOnly
                InputProps={{
                  className: "u-height-40",
                }}
              />
            </div>
            <div className="w-50 pr-4">
              <span>قیمت نهایی:</span>
              <span className="mr-1 u-fontWeightBold">
                {priceFormatter(Math.round(finalPrice))}
              </span>
              <span className="mr-1 u-fontMedium">تومان</span>
            </div>
          </div>
          <TextSwitch
            className="mt-3"
            isSwitchOn={isPercent}
            toggleSwitch={setIsPercent}
            texts={["تومان", "درصد"]}
          />
        </Collapse>
        <div className="mt-3 u-relative">
          <Input
            size="medium"
            label="هزینه‌ی بسته‌بندی محصول (تومان)"
            value={
              packagingPrice ? englishNumberToPersianNumber(packagingPrice) : ""
            }
            onChange={(value) =>
              setProduct({
                ...product,
                extra_data: {
                  ...product.extra_data,
                  packaging_price: value,
                },
              })
            }
            numberOnly
          />
        </div>
      </div>
      <div className="col-12 col-lg-6 mt-lg-4">
        <div className="d-flex align-items-center">
          <div className="mt-3 flex-1 d-flex align-items-center">
            <Checkbox
              color="primary"
              checked={product.is_active}
              onChange={(e) =>
                setProduct({
                  ...product,
                  is_active: e.target.checked,
                })
              }
            />
            <Box color={theme.palette.text.tertiary}>
              {is_active ? "فعال" : "غیرفعال"}
            </Box>
          </div>
          <div className="mt-3 flex-1 d-flex align-items-center">
            <Checkbox
              color="primary"
              checked={product.keep_tracking}
              onChange={(e) =>
                setProduct({
                  ...product,
                  keep_tracking: e.target.checked,
                })
              }
            />
            <Box color={theme.palette.text.tertiary}>انبارگردانی</Box>
          </div>
        </div>
        <div className="mt-2 d-flex">
          <Autocomplete
            options={inventoryOptions}
            autoHighlight
            freeSolo
            disabled={!product.keep_tracking}
            inputValue={
              product.keep_tracking
                ? inventoryCount || inventoryCount === 0
                  ? englishNumberToPersianNumber(inventoryCount)
                  : ""
                : "نامحدود"
            }
            onInputChange={(e, value) => {
              setProduct({
                ...product,
                inventory_count:
                  value === "" ? 0 : parseInt(persianToEnglishNumber(value)),
              });
            }}
            defaultValue={{
              label: "",
              value:
                inventoryCount || inventoryCount === 0
                  ? englishNumberToPersianNumber(inventoryCount)
                  : "",
            }}
            PaperComponent={(props) => (
              <Paper
                {...props}
                style={{
                  ...props.style,
                  marginTop: 4,
                  borderRadius: "0 0 4px 4px",
                }}
                elevation={3}
              />
            )}
            getOptionLabel={(option) =>
              englishNumberToPersianNumber(option.value, "")
            }
            renderOption={(option) => <span>{option.label}</span>}
            ListboxProps={{ style: { fontSize: 13 } }}
            className="w-100"
            renderInput={(params) => (
              <Input
                {...params}
                InputLabelProps={{ shrink: true }}
                label={"موجودی"}
                size="medium"
                InputProps={{
                  ...params.InputProps,
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
                            if (inventoryCount >= 0)
                              setProduct({
                                ...product,
                                inventory_count: +inventoryCount + 1,
                              });
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
                            if (inventoryCount > 0)
                              setProduct({
                                ...product,
                                inventory_count: inventoryCount - 1,
                              });
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
                inputProps={{
                  ...params.inputProps,
                  className: `${params.inputProps.className} pr-3 ${
                    is_active ? "placeholder-active" : "placeholder-error"
                  }`,
                }}
              />
            )}
          />
        </div>
        <div className="mt-3">
          <Select
            className="medium"
            inputData={{
              value: "",
              defaultValue: "فقط موجود در روزهای خاص (غذای روز)",
            }}
            options={availableOnDayOptions}
            selectOption={(text) =>
              addDay(
                availableOnDayOptions.find((option) => option.text === text)
              )
            }
          />
          <div className="d-flex mt-2 flex-wrap">
            {selectedDays.map((c, index) => (
              <Chip
                key={`${c.text}-${index}`}
                style={{ direction: "ltr" }}
                label={c.text}
                onDelete={() => {
                  removeDay(c);
                }}
                variant="outlined"
                className="m-1"
              />
            ))}
          </div>
        </div>
      </div>
    </Paper>
  );
}

PriceSection.propTypes = {
  product: PropTypes.object,
  setProduct: PropTypes.func,
};
