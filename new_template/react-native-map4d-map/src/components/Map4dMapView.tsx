import {
    requireNativeComponent,
    UIManager,
    Platform,
    ViewStyle,
  } from 'react-native';
  
  const LINKING_ERROR =
    `The package 'react-native-map4d-map' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo managed workflow\n';
  
  type Map4dMapProps = {
    color: string;
    style: ViewStyle;
  };
  
  const ComponentName = 'Map4dMapView';
  
  export const Map4dMapView =
    UIManager.getViewManagerConfig(ComponentName) != null
      ? requireNativeComponent<Map4dMapProps>(ComponentName)
      : () => {
          throw new Error(LINKING_ERROR);
        };
  