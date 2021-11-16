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

const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * The directions to display on the map,
   * retrieved as an array of array of coordinates to describe the routes.
   * Similar to directions prop but has higher priority
   */
  routes: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      })
    )
  ),

  /**
   * The directions to display on the map,
   * retrieved as a json string from Get route Map4D API (/sdk/route).
   * Similar to routes prop but with lower priority
   */
  directions: PropTypes.string,

  /**
   * The index of the main route, default value is 0.
   */
  activedIndex: PropTypes.number,

  /**
   * The active route stroke width.
   */
  activeStrokeWidth: PropTypes.number,

  /**
   * The active route color.
   */
  activeStrokeColor: ColorPropType,

  /**
   * The active route outline stroke width.
   */
  activeOutlineWidth: PropTypes.number,

  /**
   * The active route outline color.
   */
  activeOutlineColor: ColorPropType,

  /**
   * The inactive route stroke width.
   */
  inactiveStrokeWidth: PropTypes.number,

  /**
   * The inactive route color.
   */
  inactiveStrokeColor: ColorPropType,

  /**
   * The inactive route outline stroke width.
   */
  inactiveOutlineWidth: PropTypes.number,

  /**
   * The inactive route outline color.
   */
  inactiveOutlineColor: ColorPropType,

  /**
   * Callback that is called when the user presses on the routes
   */
  onPress: PropTypes.func,
};

class MFDirectionsRenderer extends React.Component {
  constructor(props) {
    super(props)
    this._ref = this._ref.bind(this)
    this._onPress = this._onPress.bind(this)
  }

  setActivedIndex(index) {
    this._runCommand("setActivedIndex", [index])
  }

  setDirections(directions) {
    this._runCommand("setDirections", [directions])
  }

  render() {
    return <RMFDirectionsRenderer
      {...this.props}
      ref={this._ref}
      onPress={this._onPress}
    />;
  }

  _ref(ref) {
    this.renderer = ref;
  }

  _onPress(event) {
    event.stopPropagation();
      if (this.props.onPress) {
        this.props.onPress(event);
    }
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

  _getHandle() {
    return findNodeHandle(this.renderer);
  }

  _uiManagerCommand(name) {
    const UIManager = NativeModules.UIManager;
    const componentName = "RMFDirectionsRenderer";

    if (!UIManager.getViewManagerConfig) {
      // RN < 0.58
      return UIManager[componentName].Commands[name];
    }

    // RN >= 0.58        
    return UIManager.getViewManagerConfig(componentName).Commands[name];
  }

  _mapManagerCommand(name) {
    return NativeModules[`RMFDirectionsRenderer`][name];
  }
}

MFDirectionsRenderer.propTypes = propTypes;

var RMFDirectionsRenderer = requireNativeComponent(`RMFDirectionsRenderer`, MFDirectionsRenderer);

export { MFDirectionsRenderer }
