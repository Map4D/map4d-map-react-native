import React from 'react';
import PropTypes from 'prop-types';
import {
  requireNativeComponent,
  Platform,
  NativeModules,
  ViewPropTypes,
  ColorPropType,
  findNodeHandle,
  processColor
} from 'react-native';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * An array of coordinates to describe the polygon
   */
  coordinates: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Latitude/Longitude coordinates
       */
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    })
  ),

  /**
   * The color to use for the path.
   */
  color: ColorPropType,

  /**
   * The stroke width to use for the path.
   */
  width: PropTypes.number,

  /**
   * The default style is `solid`.
   */
  lineStyle: PropTypes.oneOf(['solid', 'dotted']),

  /**
   * zIndex
   */
  zIndex: PropTypes.number,

  /**
   * visible
   */
  visible: PropTypes.bool,

  /**
   * userData
   */
  userData:PropTypes.object,

  /**
   * Callback that is called when the user presses on the polyline
   */
  onPress: PropTypes.func,
};


class MFPolyline extends React.Component {
  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this)
    this._ref = this._ref.bind(this)
  }

  _onPress(event) {
    event.stopPropagation();
      if (this.props.onPress) {
        this.props.onPress(event);
    }
  }

  _ref(ref) {
    this.polyline = ref;
  }

  // TODO - bug
  setCoordinates(coordinates) {
    this._runCommand("setCoordinates", [coordinates])
  }

  setWidth(width) {
    this._runCommand("setWidth", [width])
  }

  setColor(color) {
    this._runCommand("setColor", [processColor(color)])
  }

  setVisible(visible) {
    this._runCommand("setVisible", [visible])
  }

  setTouchable(color) {
    this._runCommand("setTouchable", [touchable])
  }

  setZIndex(zIndex) {
    this._runCommand("setZIndex", [touchable])
  }

  setLineStyle(style) {
    this._runCommand("setLineStyle", [style])
  }

  setUserData(userData) {
    this._runCommand("setUserData", [userData])
  }

  _getHandle() {
    return findNodeHandle(this.polyline);
  }

  _runCommand(name, args) {
    switch (Platform.OS) {
      case 'android':
        NativeModules.UIManager.dispatchViewManagerCommand(
          this._getHandle(),
          this._uiManagerCommand(name),
          args
        );
        break;

      case 'ios':
        this._mapManagerCommand(name)(this._getHandle(), ...args);
        break;

      default:
        break;
    }
  }

  _uiManagerCommand(name) {
    const UIManager = NativeModules.UIManager;
    const componentName = "RMFPolyline";

    if (!UIManager.getViewManagerConfig) {
      // RN < 0.58
      return UIManager[componentName].Commands[name];
    }

    // RN >= 0.58        
    return UIManager.getViewManagerConfig(componentName).Commands[name];
  }

  _mapManagerCommand(name) {
    return NativeModules[`RMFPolyline`][name];
  }

  render() {
    return <RMFPolyline
      {...this.props}
      ref={this._ref}
      onPress={this._onPress}
    />;
  }
}

MFPolyline.propTypes = propTypes;

var RMFPolyline = requireNativeComponent(`RMFPolyline`, MFPolyline);

export { MFPolyline }
