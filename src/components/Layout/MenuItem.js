import React, { useEffect, useState } from "react";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "../Icon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import { Collapse } from "react-collapse";
import { ICONS } from "../../../assets/images/icons";

function MenuItem({ route = {}, subRoutes = [], history, setOpen, open }) {
  const isActive = history.location.pathname.includes(route.path);
  const [collapse, setCollapse] = useState(
    history.location.pathname.includes(route.path)
  );
  useEffect(() => {
    if (!open) setCollapse(false);
  }, [open]);
  if (!subRoutes.length)
    return (
      <ListItem
        button
        className="mx-2"
        style={{
          paddingLeft: 23,
          paddingRight: 23,
          width: "calc(100% - 20px)",
          backgroundColor: isActive ? "#f0f2f3" : "",
          borderRadius: 8,
        }}
        key={route.title}
        onClick={() => {
          history.push(route.path);
        }}
      >
        <ListItemIcon style={{ minWidth: 30 }}>
          <Icon
            icon={route.icon}
            size={18}
            styles={{ marginRight: -10 }}
            color={isActive ? "#0050FF" : "#98a9b1"}
          />
        </ListItemIcon>
        <ListItemText
          className={`text-right ${!isActive && "u-text-dark-grey"}`}
          primary={route.title}
        />
      </ListItem>
    );
  return (
    <div>
      <ListItem
        style={{
          paddingLeft: 23,
          paddingRight: 23,
        }}
        button
        key={route.title}
        onClick={() => {
          setOpen(true);
          setCollapse(!collapse);
        }}
      >
        <ListItemIcon style={{ minWidth: 40 }}>
          <Icon
            icon={route.icon}
            size={18}
            color={isActive ? "#667e8a" : "#98a9b1"}
          />
        </ListItemIcon>
        <ListItemText
          className={`text-right ${!isActive && "u-text-dark-grey"}`}
          primary={route.title}
        />
        <Icon
          icon={ICONS.CHEVRON}
          size={24}
          color={isActive ? "#667e8a" : "#98a9b1"}
          styles={{
            transition: "all 300ms linear",
            transform: collapse ? "rotate(90deg)" : "rotate(-90deg)",
          }}
        />
      </ListItem>
      <Collapse
        isOpened={collapse}
        theme={{
          collapse: "ReactCollapse--collapse",
          content: "ReactCollapse--content pt-1 pb-2",
        }}
      >
        {subRoutes.map((subRoute) => {
          const active = history.location.pathname.includes(subRoute.path);
          return (
            <ListItem
              button
              className="mx-2"
              style={{
                width: "calc(100% - 20px)",
                backgroundColor: active ? "#f0f2f3" : "",
                borderRadius: 8,
                paddingLeft: 23,
                paddingRight: 23,
              }}
              key={subRoute.title}
              onClick={() => {
                history.push(subRoute.path);
              }}
            >
              <ListItemIcon style={{ minWidth: 30 }}>
                <Icon
                  icon={subRoute.icon}
                  size={18}
                  color={active ? "#0050FF" : "#98a9b1"}
                  styles={{ marginRight: -10 }}
                />
              </ListItemIcon>
              <ListItemText
                className={`text-right ${
                  active ? "u-text-primary-blue" : "u-text-dark-grey"
                }`}
                primary={subRoute.title}
              />
            </ListItem>
          );
        })}
      </Collapse>
    </div>
  );
}

export default MenuItem;
