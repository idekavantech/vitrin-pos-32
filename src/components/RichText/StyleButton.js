/* eslint-disable react/prop-types */
import React from 'react';
import { handleKeyDown } from "../../../utils/helper";
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span
        onKeyDown={e => handleKeyDown(e, this.onToggle)}
        role="button"
        tabIndex="0"
        className={className}
        onMouseDown={this.onToggle}
      >
        {this.props.label}
      </span>
    );
  }
}

export default StyleButton;
