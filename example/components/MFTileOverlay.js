import PropTypes from "prop-types";
import React from 'react';
import {
  requireNativeComponent,
  View,
  ViewPropTypes,
} from 'react-native';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;
const propTypes = {
  ...viewPropTypes,

  /**
   * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
   * For example, https://tile.openstreetmap.de/{z}/{x}/{y}.png
   */
  urlTemplate: PropTypes.string.isRequired,

  /**
   * visible
   */
  visible: PropTypes.bool,

  /**
   * The order in which this tile overlay is drawn with respect to other overlays. An overlay
   * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
   * with the same z-index is arbitrary. The default zIndex is 0.
   */
  zIndex: PropTypes.number,
};

class MFTileOverlay extends React.Component {
  render() {
    return <RMFTileOverlay
      {...this.props}
    />;
  }
}

MFTileOverlay.propTypes = propTypes;

var RMFTileOverlay = requireNativeComponent(`RMFTileOverlay`, MFTileOverlay);

export { MFTileOverlay }
