import React, { useState } from "react";
import PropTypes from "prop-types";
import Collapse from "@material-ui/core/Collapse";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import Input from "../../components/Input";

export default function InfoTable({ product, setProduct }) {
  const {
    extra_data: { info_table: infoTable = [] },
  } = product;
  const [collapse, setCollapse] = useState(Boolean(infoTable.length));
  return (
    <Paper className="my-3 pr-3 pt-2 pb-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Checkbox
            color="primary"
            checked={collapse}
            onChange={(e) => {
              setCollapse(e.target.checked);
              if (!e.target.checked)
                setProduct({
                  ...product,
                  extra_data: { ...product.extra_data, info_table: [] },
                });
              else
                setProduct({
                  ...product,
                  extra_data: {
                    ...product.extra_data,
                    info_table: [{ key: "", value: "" }],
                  },
                });
            }}
          />
          <Box className="u-fontLarge u-text-night">جدول مشخصات</Box>
        </div>
      </div>
      <Collapse in={collapse}>
        <div className="px-3">
          {infoTable.map((row, index) => (
            <div className="d-flex align-items-start" key={row.key}>
              <div style={{ flex: 3 }} className="mx-1 mt-1">
                <Input
                  size="medium"
                  value={row.key}
                  label="عنوان ویژگی"
                  onChange={(value) => {
                    const newProductInfoTable = [...infoTable];
                    newProductInfoTable[index].key = value;
                    setProduct({
                      ...product,
                      extra_data: {
                        ...product.extra_data,
                        info_table: newProductInfoTable,
                      },
                    });
                  }}
                />
                {row.key === "" ? (
                  <div className="pr-1 u-font-semi-small u-text-darkest-grey">
                    مثال: ابعاد
                  </div>
                ) : null}
              </div>
              <div style={{ flex: 5 }} className="mx-1 mt-1">
                <Input
                  size="medium"
                  value={row.value}
                  label="توضیحات ویژگی"
                  onChange={(value) => {
                    const newProductInfoTable = [...infoTable];
                    newProductInfoTable[index].value = value;
                    setProduct({
                      ...product,
                      extra_data: {
                        ...product.extra_data,
                        info_table: newProductInfoTable,
                      },
                    });
                  }}
                />
                {row.value === "" ? (
                  <div className="pr-1 u-font-semi-small u-text-darkest-grey">
                    مثال: ۳۳*۵۰*۵۸
                  </div>
                ) : null}
              </div>
              <IconButton
                onClick={() =>
                  setProduct({
                    ...product,
                    extra_data: {
                      ...product.extra_data,
                      info_table: infoTable.filter((r, i) => i !== index),
                    },
                  })
                }
                edge="end"
              >
                <DeleteIcon color="primary" />
              </IconButton>
              <IconButton
                onClick={() => {
                  const newProductInfoTable = [...infoTable];
                  newProductInfoTable.splice(index + 1, 0, {
                    key: "",
                    value: "",
                  });
                  setProduct({
                    ...product,
                    extra_data: {
                      ...product.extra_data,
                      info_table: newProductInfoTable,
                    },
                  });
                }}
                edge="end"
              >
                <AddCircleOutlineRoundedIcon color="primary" />
              </IconButton>
            </div>
          ))}
          {!infoTable.length ? (
            <Button
              className="u-cursor-pointer"
              onClick={() =>
                setProduct({
                  ...product,
                  extra_data: {
                    ...product.extra_data,
                    info_table: [...infoTable, { key: "", value: "" }],
                  },
                })
              }
              color="primary"
            >
              <AddCircleOutlineRoundedIcon className="ml-2" color="primary" />
              افزودن ردیف جدید
            </Button>
          ) : null}
        </div>
      </Collapse>
    </Paper>
  );
}

InfoTable.propTypes = {
  productInfoTable: PropTypes.array,
  setProductInfoTable: PropTypes.func,
};
