/* eslint-disable indent */
import React, { memo } from "react";
import qs from "qs";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import { englishNumberToPersianNumber } from "../../../utils/helper";
import { ICONS } from "../../../assets/images/icons";

function Pagination({
  location,
  pagination,
  keyword = "page",
  style = { backgroundColor: "white" },
}) {
  if (!pagination) return null;
  const queries = qs.parse(location.search, { ignoreQueryPrefix: true });
  const page = +queries[keyword] || 1;
  const pages = pagination.pagesCount
    ? Array.from(Array(pagination.pagesCount).keys())
        .slice(Math.max(page - 3, 0), Math.min(page + 2, pagination.pagesCount))
        .reverse()
    : [];
  return (
    <div
      className="d-flex justify-content-center align-items-center u-background-white py-2"
      style={style}
    >
      <div style={{ width: 24 }}>
        {pagination.next && (
          <Link
            to={`${location.pathname}?${qs.stringify(
              { ...queries, [keyword]: page + 1 },
              {
                skipNulls: true,
                encodeValuesOnly: true,
              }
            )}`}
            className="u-text-primary-blue d-flex justify-content-center align-items-center"
          >
            <div style={{ transform: "rotate(180deg)" }}>
              <Icon icon={ICONS.CHEVRON} color="#667e8a" size={24} />
            </div>
          </Link>
        )}
      </div>
      <div className="d-flex justify-content-center align-items-center">
        {pages[0] + 1 < pagination.pagesCount && (
          <div className="d-flex align-items-center">
            <span>...</span>
          </div>
        )}
        {pages.map((p) => (
          <Link
            key={`page-${p}`}
            to={`${location.pathname}?${qs.stringify(
              { ...queries, [keyword]: p + 1 },
              {
                skipNulls: true,
                encodeValuesOnly: true,
              }
            )}`}
          >
            <div
              className="u-border-radius-4 px-2"
              style={{
                backgroundColor:
                  p + 1 === +page ? "#0050FF" : style.backgroundColor,
                fontWeight: p + 1 === +page ? "bold" : "normal",
                color: p + 1 === +page ? "white" : "#667e8a",
              }}
            >
              {englishNumberToPersianNumber(p + 1)}
            </div>
          </Link>
        ))}
        {pages[pages.length - 1] > 0 && (
          <div className="d-flex align-items-center">
            <span>...</span>
            <Link
              to={`${location.pathname}?${qs.stringify(
                { ...queries, [keyword]: 1 },
                {
                  skipNulls: true,
                  encodeValuesOnly: true,
                }
              )}`}
              className="px-2"
            >
              <div className="u-border-radius-50-percent u-text-darkest-grey">
                ۱
              </div>
            </Link>
          </div>
        )}
      </div>
      <div style={{ width: 24 }}>
        {pagination.previous && (
          <Link
            to={`${location.pathname}?${qs.stringify(
              { ...queries, [keyword]: page - 1 },
              {
                skipNulls: true,
                encodeValuesOnly: true,
              }
            )}`}
            className="u-text-primary-blue d-flex justify-content-center align-items-center"
          >
            <Icon icon={ICONS.CHEVRON} color="#667e8a" size={24} />
          </Link>
        )}
      </div>
    </div>
  );
}

Pagination.propTypes = {
  location: PropTypes.object,
  pagination: PropTypes.object,
};
export default memo(Pagination);
