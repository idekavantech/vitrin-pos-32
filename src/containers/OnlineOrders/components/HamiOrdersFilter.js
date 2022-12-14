import Checkbox from "@material-ui/core/Checkbox";
import React, { useEffect, useState } from "react";
import { PERSONAL_VITRIN_SALE_CHANNEL } from "../constants";

export default function HamiOrdersFilter({ siteDomain, updateOrders, salesChannels }) {
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
            updateOrders(e.target.checked ? { sales_channel: Object.keys(salesChannels).map((key) => {
                if(salesChannels[key].data.type === PERSONAL_VITRIN_SALE_CHANNEL)
                  return key
              })[0] } : {});
          }}
        />
        <div>فقط سفارش‌های ویترین</div>
      </div>
    );
  return null;
}
