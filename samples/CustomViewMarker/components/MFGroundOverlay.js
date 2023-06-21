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
   * A region will be display ground overlay.
   */
   bounds: PropTypes.shape({
    northEast: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    southWest: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired
   }),

  /**
   * If `true` the ground overlay will override base map. All object of base map at this
   * position will not display. The default value is false. 
   */
  override: PropTypes.bool,

  /**
   * visible
   */
  visible: PropTypes.bool,

  /**
   * The order in which this ground overlay is drawn with respect to other overlays. An overlay
   * with a larger z-index is drawn over overlays with smaller z-indices. The order of overlays
   * with the same z-index is arbitrary. The default zIndex is 0.
   */
  zIndex: PropTypes.number,
};

class MFGroundOverlay extends React.Component {
  render() {
    return <RMFGroundOverlay
      {...this.props}
    />;
  }
}

MFGroundOverlay.propTypes = propTypes;

var RMFGroundOverlay = requireNativeComponent(`RMFGroundOverlay`, MFGroundOverlay);

export { MFGroundOverlay }
