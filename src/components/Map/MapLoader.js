/* eslint-disable no-unused-vars */
import React, { memo, useRef } from "react";
import PropTypes from "prop-types";
import { DivIcon } from "leaflet";
import Map from "react-leaflet/lib/Map";
import TileLayer from "react-leaflet/lib/TileLayer";
import Marker from "react-leaflet/lib/Marker";
import { CDN_BASE_URL } from "../../../utils/api";

const currentLocationSvg = `${CDN_BASE_URL}currentLocation.svg`;

const calculateMarkerPosition = (index) => {
  for (let i = 0; i < 11; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      if (Math.floor(index / 10) === i && index % 10 === j) {
        return `-${j * 25.5}px -${i * 40.75}px`;
      }
    }
  }
  return 0;
};
const CustomMap = ({
  onClick,
  currentLocation,
  options: {
    height,
    width,
    ondrag,
    onzoomend,
    editMode,
    markers = [],
    center = {
      latitude: 35.70194,
      longitude: 51.389976,
    },
    zoom = 11,
    ref,
    style,
  },
}) => {
  const markerUrl = "pin-package.png";
  const icon = (index) => {
    return new DivIcon({
      html: `<div class="text-center position-relative" style='width: 30px; height: 30px; margin-top: -25px; margin-right:-9px;'>
                      <span class="position-absolute mx-auto left-0 right-0 bg-white u-border-radius-50-percent" style="width: 16px; height: 16px; top:7px;"></span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.238 28.546">
                      <path d="M11.12.995A10.13 10.13 0 0 0 .995 11.12c0 4.5 2.95 8.326 7.023 9.636l3.1 5.706 3.102-5.705c4.074-1.3 7.023-5.128 7.023-9.636A10.13 10.13 0 0 0 11.12.995z" fill="#0050ff"
                       stroke="white"
                       stroke-width="1.65"
                      />
                      </svg>
                  </div>`,
      className: "no-border no-background",
    });
  };

  const marker = useRef(null);
  const locationMarker = useRef(null);
  const map = useRef(null);
  const centerLocation = { ...center };
  const getIconIndex = (m, i) => {
    if (m.singleMarker) {
      return 30;
    }
    if (m.adsMarker) {
      return 31;
    }
    return i;
  };

  if (!centerLocation.latitude) {
    centerLocation.latitude = 35.70194;
  }
  if (!centerLocation.longitude) {
    centerLocation.longitude = 51.389976;
  }

  if (editMode) {
    return (
      <div className="position-relative">
        <div
          style={{
            width: 25.6,
            height: 40.75,
            background: `url(${CDN_BASE_URL}${markerUrl}) ${calculateMarkerPosition(
              30
            )}`,
            backgroundSize: "255px 163px",
          }}
          className="u-marker"
        />
        <Map
          ref={ref || map}
          style={{ height, width, margin: "0 auto", borderRadius: 4, ...style }}
          center={[centerLocation.latitude, centerLocation.longitude]}
          zoom={zoom}
          zoomControl={false}
          ondrag={ondrag}
          onzoomend={onzoomend}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </Map>
      </div>
    );
  }
  return (
    <Map
      ref={ref || map}
      keyboard={false}
      style={{ height, width, margin: "0 auto", borderRadius: 4, ...style }}
      center={[centerLocation.latitude, centerLocation.longitude]}
      zoom={zoom}
      zoomControl={false}
      onClick={onClick}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {currentLocation && (
        <Marker
          ref={locationMarker}
          position={[currentLocation.latitude, currentLocation.longitude]}
          icon={
            new DivIcon({
              html: `<div style="background: url('${currentLocationSvg}'); margin-top: -13px; margin-right: -11px; width: 34px; height: 34px; "></div>`,
              className: "no-border no-background",
            })
          }
        />
      )}
      {markers.length &&
        markers.map((m, i) =>
          m.latitude && m.longitude ? (
            <Marker
              key={`map-marker-${m.latitude}-${m.longitude}`}
              ref={marker}
              position={[m.latitude, m.longitude]}
              onClick={m.onClick}
              icon={icon(getIconIndex(m, i))}
            />
          ) : null
        )}
    </Map>
  );
};

CustomMap.propTypes = {
  onClick: PropTypes.func,
  currentLocation: PropTypes.object,
  options: PropTypes.object,
};

export default memo(CustomMap);
