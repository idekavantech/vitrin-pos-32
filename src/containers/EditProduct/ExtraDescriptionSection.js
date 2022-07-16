import React, { useState } from "react";
import PropTypes from "prop-types";
import Collapse from "@material-ui/core/Collapse";
import useTheme from "@material-ui/core/styles/useTheme";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillModules } from "../../../stores/ui/constants";
export default function ExtraDescriptionSection({ product, setProduct }) {
  if (!product) {
    return null;
  }
  const {
    extra_data: { complementary = "" },
  } = product;
  const [collapse, setCollapse] = useState(complementary);
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
                extra_data: { ...product.extra_data, complementary: "" },
              });
            }
          }}
        />
        <Box className="u-fontLarge" color={theme.palette.text.tertiary}>
          مشخصات تکمیلی
        </Box>
      </div>
      <Collapse in={collapse}>
        <div className="p-3 w-100">
          <ReactQuill
            placeholder="درباره این آیتم بیشتر بنویسید..."
            value={complementary || ""}
            onChange={(complementary) => {
              setProduct({
                ...product,
                extra_data: { ...product.extra_data, complementary },
              });
            }}
            modules={quillModules}
            theme="snow"
            className="text-left"
          />
        </div>
      </Collapse>
    </Paper>
  );
}

ExtraDescriptionSection.propTypes = {
  setComplementary: PropTypes.func,
  complementary: PropTypes.string,
};
