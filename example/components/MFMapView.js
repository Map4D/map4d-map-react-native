import PropTypes from 'prop-types';
import React from 'react';
import {
  requireNativeComponent,
  Platform,
  NativeModules,
  ViewPropTypes,
  ColorPropType,
  findNodeHandle
} from 'react-native';

const CameraShape = PropTypes.shape({
  target: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  zoom: PropTypes.number.isRequired,
  bearing: PropTypes.number.isRequired,
  tilt: PropTypes.number.isRequired,
});

// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

const propTypes = {
  ...viewPropTypes,

  /**
   * If `false` hide the button to move map to the current user's location.
   * Default value is `false`.
   */
  showsMyLocationButton: PropTypes.bool,

  /**
   * If `true` the app will ask for the user's location.
   * Default value is `false`.
   */
  showsMyLocation: PropTypes.bool,

  /**
   * A Boolean indicating whether the map displays buildings.
   * Default value is `true`.
   */
  showsBuildings: PropTypes.bool,

  /**
   * A Boolean indicating whether the map displays POIs.
   * Default value is `true`.
   */
  showsPOIs: PropTypes.bool,

  /**
   * If `false` the user won't be able to zoom the map.
   * Default value is `true`.
   */
  zoomGesturesEnabled: PropTypes.bool,

  /**
   * If `false` the user won't be able to scroll the map.
   * Default value is `true`.
   */
  scrollGesturesEnabled: PropTypes.bool,

  /**
   * If `false` the user won't be able to pinch/rotate the map.
   * Default value is `true`.
   */
  rotateGesturesEnabled: PropTypes.bool,

  /**
   * If `false` the user won't be able to tilt the map.
   * Default value is `true`.
   */
  tiltGesturesEnabled: PropTypes.bool,

  /**
   * The camera view position.
   */
  camera: CameraShape,

  /**
   * Type of map tiles to be rendered.
   */
  mapType: PropTypes.oneOf(['roadmap', 'raster']),

  /**
   * Callback that is called once the map is fully loaded.
   * @platform android
   */
  onMapReady: PropTypes.func,

  /**
   * Callback that is called when user taps on the map.
   */
  onPress: PropTypes.func,

  /**
   * Callback that is called when user taps on the POIs
   */
  onPoiPress: PropTypes.func,

  /**
   * Callback that is called when user taps on the Buildings
   */
  onBuildingPress: PropTypes.func,

  /**
   * Callback that is called when user taps on the Places
   */
  onPlacePress: PropTypes.func,

  /**
   * Callback that is called when change 3d mode
   */
  onModeChange: PropTypes.func,

  /**
   * Callback that is called when moving camera
   */
  onCameraMove: PropTypes.func,

  /**
   * Callback that is called when camera start moving
   */
  onCameraMoveStart: PropTypes.func,

  /**
   * Callback that is called when camera idle
   */
  onCameraIdle: PropTypes.func,

  /**
   * Callback that is called when user taps on location Button
   */
  onMyLocationButtonPress: PropTypes.func,

  /**
   * Callback that is called when user zoom in or zoom out through minimum zoom 3D
   */
  onShouldChangeMapMode: PropTypes.func
};


class MFMapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: Platform.OS === 'ios',
    };

    this._onMapReady = this._onMapReady.bind(this);
    this._ref = this._ref.bind(this);
  }

  _onMapReady() {
    const { onMapReady } = this.props;
    this.setState({ isReady: true }, () => {
      if (onMapReady) {
        onMapReady();
      }
    });
  }

  _ref(ref) {
    this.map = ref;
  }

  getCamera() {
    if (Platform.OS === 'android') {
      return NativeModules.Map4dMap.getCamera(this._getHandle());
    } else if (Platform.OS === 'ios') {
      return this._runCommand('getCamera', []);
    }
    return Promise.reject('Function not supported on this platform');
  }

  getBounds() {
    if (Platform.OS === 'android') {
      return NativeModules.Map4dMap.getBounds(this._getHandle());
    } else if (Platform.OS === 'ios') {
      return this._runCommand('getBounds', []);
    }
    return Promise.reject('Function not supported on this platform');
  }

  getMyLocation() {
    if (Platform.OS === 'android') {
      return NativeModules.Map4dMap.getMyLocation(this._getHandle());
    } else if (Platform.OS === 'ios') {
      return this._runCommand('getMyLocation', []);
    }
    return Promise.reject('Function not supported on this platform');
  }

  animateCamera(camera) {
    this._runCommand('animateCamera', [camera]);
  }

  moveCamera(camera) {
    this._runCommand('moveCamera', [camera]);
  }

  enable3DMode(enable) {
    this._runCommand('enable3DMode', [enable]);
  }

  is3DMode() {
    if (Platform.OS === 'android') {
      return NativeModules.Map4dMap.is3DMode(this._getHandle());
    } else if (Platform.OS === 'ios') {
      return this._runCommand('is3DMode', []);
    }
    return Promise.reject('Function not supported on this platform');
  }

  setMyLocationEnabled(enable) {
    this._runCommand('setMyLocationEnabled', [enable]);
  }

  showsMyLocationButton(enable) {
    this._runCommand('showsMyLocationButton', [enable]);
  }

  setPOIsEnabled(enable) {
    this._runCommand('setPOIsEnabled', [enable]);
  }

  setZoomGesturesEnabled(enable) {
    this._runCommand('setZoomGesturesEnabled', [enable]);
  }

  setScrollGesturesEnabled(enable) {
    this._runCommand('setScrollGesturesEnabled', [enable]);
  }

  setRotateGesturesEnabled(enable) {
    this._runCommand('setRotateGesturesEnabled', [enable]);
  }

  setTiltGesturesEnabled(enable) {
    this._runCommand('setTiltGesturesEnabled', [enable]);
  }

  setAllGesturesEnabled(enable) {
    this._runCommand('setAllGesturesEnabled', [enable]);
  }

  setTime(time) {
    let t = Date.parse(time)
    if (isNaN(t)) {
      console.log('time invalid')
    }
    else {
      this._runCommand('setTime', [t]);
    }
  }

  fitBounds(boundsData) {
    this._runCommand("fitBounds", [boundsData])
  }

  cameraForBounds(boundsData) {
    if (Platform.OS === 'android') {
      return NativeModules.Map4dMap.cameraForBounds(
        this._getHandle(),
        boundsData
      );
    } else if (Platform.OS === 'ios') {
      return this._runCommand('cameraForBounds', [boundsData]);
    }
    return Promise.reject('cameraForBounds not supported on this platform');
  }


  /**
   * Convert a map coordinate to screen point
   *
   * @param coordinate Coordinate
   * @param [coordinate.latitude] Latitude
   * @param [coordinate.longitude] Longitude
   *
   * @return Promise Promise with the point ({ x: Number, y: Number })
   */
  pointForCoordinate(coordinate) {
    if (Platform.OS === 'android') {
      return NativeModules.Map4dMap.pointForCoordinate(
        this._getHandle(),
        coordinate
      );
    } else if (Platform.OS === 'ios') {
      return this._runCommand('pointForCoordinate', [coordinate]);
    }
    return Promise.reject('pointForCoordinate not supported on this platform');
  }

  /**
   * Convert a screen point to a map coordinate
   *
   * @param point Point
   * @param [point.x] X
   * @param [point.x] Y
   *
   * @return Promise Promise with the coordinate ({ latitude: Number, longitude: Number })
   */
  coordinateForPoint(point) {
    if (Platform.OS === 'android') {
      return NativeModules.Map4dMap.coordinateForPoint(
        this._getHandle(),
        point
      );
    } else if (Platform.OS === 'ios') {
      return this._runCommand('coordinateForPoint', [point]);
    }
    return Promise.reject('coordinateForPoint not supported on this platform');
  }

  _getHandle() {
    return findNodeHandle(this.map);
  }

  _runCommand(name, args) {
    switch (Platform.OS) {
      case 'android':
        return NativeModules.UIManager.dispatchViewManagerCommand(
          this._getHandle(),
          this._uiManagerCommand(name),
          args
        );

      case 'ios':
        return this._mapManagerCommand(name)(this._getHandle(), ...args);

      default:
        return Promise.reject(`Invalid platform was passed: ${Platform.OS}`);
    }
  }

  _uiManagerCommand(name) {
    const UIManager = NativeModules.UIManager;
    const componentName = "RMFMapView";

    if (!UIManager.getViewManagerConfig) {
      // RN < 0.58
      return UIManager[componentName].Commands[name];
    }

    // RN >= 0.58        
    return UIManager.getViewManagerConfig(componentName).Commands[name];
  }

  _mapManagerCommand(name) {
    return NativeModules[`RMFMapView`][name];
  }


  render() {
    let props;

    if (this.state.isReady) {
      props = {
        style: this.props.style,
        onMapReady: this._onMapReady,
        ...this.props,
      };
    } else {
      props = {
        style: this.props.style,
        onMapReady: this._onMapReady
      };
    }

    return <RMFMapView
      {...props}
      ref={this._ref}
    />;
  }
}

MFMapView.propTypes = propTypes;
var RMFMapView = requireNativeComponent(`RMFMapView`, MFMapView);


export { MFMapView }