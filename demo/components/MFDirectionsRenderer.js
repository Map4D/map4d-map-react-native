import React from 'react';
import PropTypes from 'prop-types';
import {
  requireNativeComponent,
  Platform,
  Image,
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
   * The options of the origin POI.
   */
  originPOIOptions: PropTypes.shape({
    coordinate: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),

    icon: PropTypes.shape({
      uri: PropTypes.any.isRequired
    }),

    title: PropTypes.string,

    titleColor: ColorPropType,

    visible: PropTypes.bool,
  }),

  /**
   * The options of the destination POI.
   */
  destinationPOIOptions: PropTypes.shape({
    coordinate: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),

    icon: PropTypes.shape({
      uri: PropTypes.any.isRequired
    }),

    title: PropTypes.string,

    titleColor: ColorPropType,

    visible: PropTypes.bool,
  }),

  /**
   * Callback that is called when the user presses on the routes.
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

  setRoutes(routes) {
    this._runCommand("setRoutes", [routes])
  }

  setDirections(directions) {
    this._runCommand("setDirections", [directions])
  }

  render() {
    let originPOIOptions = this.props.originPOIOptions
    if (originPOIOptions) {
      if (originPOIOptions.titleColor) {
        originPOIOptions.titleColor = processColor(originPOIOptions.titleColor)
      }
      if (originPOIOptions.icon) {
        let uri = Image.resolveAssetSource(originPOIOptions.icon.uri) || {uri: originPOIOptions.icon.uri};
        originPOIOptions.icon = {uri: uri.uri}
      }
    }

    let destinationPOIOptions = this.props.destinationPOIOptions
    if (destinationPOIOptions) {
      if (destinationPOIOptions.titleColor) {
        destinationPOIOptions.titleColor = processColor(destinationPOIOptions.titleColor)
      }
      if (destinationPOIOptions.icon) {
        let uri = Image.resolveAssetSource(destinationPOIOptions.icon.uri) || {uri: destinationPOIOptions.icon.uri};
        destinationPOIOptions.icon = {uri: uri.uri}
      }
    }

    return <RMFDirectionsRenderer
      {...this.props}
      originPOIOptions={originPOIOptions}
      destinationPOIOptions={destinationPOIOptions}
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
