import React from 'react';
import PropTypes from 'prop-types';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import {
  requireNativeComponent,
  Platform,
  NativeModules,
  findNodeHandle
} from 'react-native';

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * The name of the building.
   */
  name: PropTypes.string,

  /**
   * The position of the building
   */
  coordinate: PropTypes.shape({
    /**
     * Position for the building.
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),

  /**
   * The model URL for the building.
   */
  modelUrl: PropTypes.string,

  /**
   * The texture URL for the building.
   */
  textureUrl: PropTypes.string,

  /**
   * The scale of the building.
   */
  scale: PropTypes.number,

  /**
   * The bearing of the building.
   */
  bearing: PropTypes.number,

  /**
   * The elevation of the building.
   */
  elevation: PropTypes.number,

  /**
   * Is the building selectable by the user ?
   */
  selected: PropTypes.bool,

  /**
   * touchable
   */
  touchable: PropTypes.bool,

  /**
   * visible
   */
  visible: PropTypes.bool,

  /**
   * userData
   */
  userData:PropTypes.object,

  /**
   * Callback that is called when the user presses on the building
   */
  onPress: PropTypes.func,
};


class MFBuilding extends React.Component {
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
    this.building = ref;
  }

  setName(name) {
    this._runCommand("setName", [name])
  }

  setScale(scale) {
    this._runCommand("setScale", [scale])
  }

  setBearing(bearing) {
    this._runCommand("setBearing", [bearing])
  }

  setElevation(elevation) {
    this._runCommand("setElevation", [elevation])
  }

  setSelected(selected) {
    this._runCommand("setSelected", [selected])
  }

  setTouchable(touchable) {
    this._runCommand("setTouchable", [touchable])
  }

  setVisible(visible) {
    this._runCommand("setVisible", [visible])
  }

  setUserData(userData) {
    this._runCommand("setUserData", [userData])
  }

  _getHandle() {
    return findNodeHandle(this.building);
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
    const componentName = "RMFBuilding";

    if (!UIManager.getViewManagerConfig) {
      // RN < 0.58
      return UIManager[componentName].Commands[name];
    }

    // RN >= 0.58
    return UIManager.getViewManagerConfig(componentName).Commands[name];
  }

  _mapManagerCommand(name) {
    return NativeModules[`RMFBuilding`][name];
  }

  render() {
    return <RMFBuilding
      {...this.props}
      ref={this._ref}
      onPress={this._onPress}
    />;
  }
}

MFBuilding.propTypes = propTypes;

var RMFBuilding = requireNativeComponent(`RMFBuilding`, MFBuilding);

export { MFBuilding }