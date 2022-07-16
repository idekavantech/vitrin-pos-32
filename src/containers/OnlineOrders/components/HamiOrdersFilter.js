import Checkbox from "@material-ui/core/Checkbox";
import React, { useEffect, useState } from "react";

export default function HamiOrdersFilter({ siteDomain, updateOrders }) {
  const [onlyVitrin, setOnlyVitrin] = useState(true);
  if (
    localStorage.getItem("integrated") === "hami" &&
    (
      JSON.parse(localStorage.getItem("hamiIntegratedBusinesses")) || []
    ).includes(siteDomain)
  )
    return (
      <div className="d-flex align-items-center">
        <Checkbox
          color="primary"
          checked={onlyVitrin}
          onChange={(e) => {
            setOnlyVitrin(e.target.checked);
            updateOrders(!e.target.checked ? { sales_channel: null } : {});
          }}
        />
        <div>فقط سفارش‌های ویترین</div>
      </div>
    );
  return null;
}
