import React from "react";
import PropTypes from "prop-types";

function Icon({ className, width, height, size, icon, color, styles: style, onClick = () => {} }) {
  const styles = {
    svg: {
      display: "inline-block",
      verticalAlign: "middle",
      fill: "none",
    },
    path: {
      fill: color,
    },
  };

  return (
    <svg
      style={{ ...styles.svg, ...style }}
      className={className}
      width={`${width || `${size}px`}`}
      height={`${height || `${size}px`}`}
      viewBox={`0 0 ${size || width} ${size || height}`}
      onClick={onClick}>
      {icon.map((iconElement) => {
        if (iconElement.d)
          return (
            <path
              key={iconElement.key}
              {...iconElement}
              style={iconElement.fill ? {} : styles.path}
            />
          );
        if (iconElement.rect)
          return (
            <rect
              {...iconElement.rect}
              key={iconElement.key}
              style={iconElement.fill ? { fill: iconElement.fill } : styles.path}
            />
          );
        if (iconElement.circle)
          return (
            <circle
              {...iconElement.circle}
              key={iconElement.key}
              style={iconElement.fill ? { fill: iconElement.fill } : styles.path}
            />
          );
        if (iconElement.line)
          return (
            <line
              {...iconElement.line}
              stroke={color}
              key={iconElement.key}
              style={iconElement.fill ? { fill: iconElement.fill } : styles.path}
            />
          );
        return null;
      })}
    </svg>
  );
}

Icon.propTypes = {
  icon: PropTypes.array.isRequired,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  size: 16,
};

export default Icon;
