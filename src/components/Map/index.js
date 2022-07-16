/* eslint-disable global-require */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';

let Map;
let MapComponents;
export default class LeafletMap extends Component {
  componentDidMount() {
    // Only runs on Client, not on server render
    Map = require('react-leaflet').Map;
    MapComponents = require('./MapLoader').default;
    this.forceUpdate();
  }

  render() {
    return Map ? <MapComponents {...this.props} /> : null;
  }
}
