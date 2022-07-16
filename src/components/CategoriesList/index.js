/**
 *
 * CategoriesHandler
 *
 */

import React, { memo, useRef } from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/esm/Chip";

import Flickity from "../Flickity";

function CategoriesList(props) {
  const { categories, onItemClick, selectedId } = props;

  const flkty = useRef(null);
  const flickityOptions = {
    rightToLeft: true,
    prevNextButtons: false,
    pageDots: false,
    cellAlign: "right",
    freeScroll: true,
    contain: true,
  };
  const dragging = useRef(false);
  return (
    <div className="c-category-component">
      <div className="d-flex align-items-center">
        <Flickity
          className="carousel container p-2"
          elementType="div"
          options={flickityOptions}
          disableImagesLoaded={false}
          dragging={dragging}
          flickityRef={flkty}
        >
          <Chip
            label="همه"
            onClick={() => {
              if (!dragging.current) onItemClick();
            }}
            variant="outlined"
            style={{
              color: "all" === selectedId ? "#0050ff" : "#667e8a",
              borderColor: "all" === selectedId ? "#0050ff" : "#667e8a",
              fontWeight: "all" === selectedId ? "bold" : "normal",
            }}
            className="m-1"
          />

          {categories &&
            categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => {
                  if (!dragging.current) onItemClick(category);
                }}
                variant="outlined"
                style={{
                  color:
                    category.id.toString() === selectedId
                      ? "#0050ff"
                      : "#667e8a",
                  borderColor:
                    category.id.toString() === selectedId
                      ? "#0050ff"
                      : "#667e8a",
                  fontWeight:
                    category.id.toString() === selectedId ? "bold" : "normal",
                }}
                className="m-1"
              />
            ))}
        </Flickity>
      </div>
    </div>
  );
}

CategoriesList.propTypes = {
  categories: PropTypes.array.isRequired,
  onItemClick: PropTypes.func,
  history: PropTypes.object,
  selectedId: PropTypes.string,
};

export default memo(CategoriesList);
