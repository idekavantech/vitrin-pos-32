import React, { useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import VolumeUpRoundedIcon from "@material-ui/icons/VolumeUpRounded";
import { englishNumberToPersianNumber } from "../../../utils/helper";
import VolumeMuteRoundedIcon from "@material-ui/icons/VolumeMuteRounded";
import VolumeDownRoundedIcon from "@material-ui/icons/VolumeDownRounded";

export default function SoundSettings() {
  const [volume, setVolume] = useState(50);
  useEffect(() => {
    const volume =
      localStorage.getItem("volume") !== "0"
        ? parseFloat(localStorage.getItem("volume")) || 20
        : 0;
    if (volume > 1) setVolume(volume + 50);
    else setVolume(volume * 50);
  }, []);
  const handleSliderChange = (event, newValue) => {
    setVolume(newValue);
    if (newValue >= 50) localStorage.setItem("volume", newValue - 50);
    else localStorage.setItem("volume", Number(newValue / 50).toFixed(2));
  };
  return (
    <>
      <div className="u-border-radius-8 container px-0 container-shadow mt-5">
        <div
          style={{ height: 70 }}
          className="px-5 py-3 d-flex justify-content-between align-items-center"
        >
          <div className="u-fontWeightBold u-text-black">تنظیمات صدا</div>
        </div>
        <div
          className="u-background-white p-5"
          style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          <div className="d-flex u-text-black">
            <div style={{ width: 50 }} className="text-center">
              {englishNumberToPersianNumber(volume)}
            </div>
            <div style={{ width: 320 }}>
              <Slider
                className="u-text-primary-blue"
                value={typeof volume === "number" ? volume : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
              />
            </div>
            {volume > 50 && (
              <VolumeUpRoundedIcon className="u-text-primary-blue mr-3" />
            )}
            {volume < 50 && volume > 0.2 && (
              <VolumeDownRoundedIcon className="u-text-primary-blue mr-3" />
            )}
            {volume < 0.2 && (
              <VolumeMuteRoundedIcon className="u-text-primary-blue mr-3" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
