// @flow strict-local

import type {
  BubblingEventHandler,
  DirectEventHandler,
  Double,
  WithDefault,
  UnsafeMixed,
} from 'react-native/Libraries/Types/CodegenTypes';
import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type CameraTarget = $ReadOnly<{|
  latitude: Double,
  longitude: Double,
|}>;

type Camera = $ReadOnly<{|
  target?: CameraTarget,
  zoom?: Double,
  bearing?: Double,
  tilt?: Double,
|}>;

type MapReadyEventData = $ReadOnly<{||}>;

type PressEventData = $ReadOnly<{|
  location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  pixel: $ReadOnly<{|x: Double, y: Double|}>,
  action: string,
|}>;

type PoiPressEventData = $ReadOnly<{|
  location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  pixel: $ReadOnly<{|x: Double, y: Double|}>,
  poi: $ReadOnly<{|
    id: string,
    title: string,
    location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  |}>,
  action: string,
|}>;

type BuildingPressEventData = $ReadOnly<{|
  location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  pixel: $ReadOnly<{|x: Double, y: Double|}>,
  building: $ReadOnly<{|
    id: string,
    name: string,
    location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  |}>,
  action: string,
|}>;

type PlacePressEventData = $ReadOnly<{|
  location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  pixel: $ReadOnly<{|x: Double, y: Double|}>,
  place: $ReadOnly<{|
    name: string,
    location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  |}>,
  action: string,
|}>;

type DataSourceFeaturePressEventData = $ReadOnly<{|
  location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  pixel: $ReadOnly<{|x: Double, y: Double|}>,
  feature: $ReadOnly<{|
    source: string,
    sourceLayer: string,
    layerType: string,
    properties: UnsafeMixed,
    location: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  |}>,
  action: string,
|}>;

type CameraChangeEventData = $ReadOnly<{|
  center: $ReadOnly<{|latitude: Double, longitude: Double|}>,
  zoom: Double,
  bearing: Double,
  tilt: Double,
  action: string,
|}>;

type MyLocationButtonPressEventData = $ReadOnly<{|
  action: string,
|}>;

type NativeProps = Readonly<{
  ...ViewProps,

  mapID?: WithDefault<string, ''>,
  mapStyle?: WithDefault<string, ''>,
  mapType?: WithDefault<string, 'roadmap'>,
  camera?: Camera,

  showsMyLocationButton?: WithDefault<boolean, true>,
  showsMyLocation?: WithDefault<boolean, true>,
  showsBuildings?: WithDefault<boolean, true>,
  showsPOIs?: WithDefault<boolean, true>,

  zoomGesturesEnabled?: WithDefault<boolean, true>,
  scrollGesturesEnabled?: WithDefault<boolean, true>,
  rotateGesturesEnabled?: WithDefault<boolean, true>,
  tiltGesturesEnabled?: WithDefault<boolean, true>,

  onMapReady?: BubblingEventHandler<MapReadyEventData>,
  onPress?: BubblingEventHandler<PressEventData>,
  onPoiPress?: DirectEventHandler<PoiPressEventData>,
  onBuildingPress?: DirectEventHandler<BuildingPressEventData>,
  onPlacePress?: DirectEventHandler<PlacePressEventData>,
  onDataSourceFeaturePress?: DirectEventHandler<DataSourceFeaturePressEventData>,
  onCameraMove?: DirectEventHandler<CameraChangeEventData>,
  onCameraMoveStart?: DirectEventHandler<CameraChangeEventData>,
  onCameraIdle?: DirectEventHandler<CameraChangeEventData>,
  onMyLocationButtonPress?: DirectEventHandler<MyLocationButtonPressEventData>,
}>;

export default (codegenNativeComponent<NativeProps>('RMFMapView', {
  excludedPlatforms: ['android'],
}): HostComponent<NativeProps>);
