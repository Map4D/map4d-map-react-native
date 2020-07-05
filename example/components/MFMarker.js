import React from 'react';
import {
  requireNativeComponent,
  Platform,
  Image,
  NativeModules,
  findNodeHandle
} from 'react-native';


class MFMarker extends React.Component {
    constructor(props) {
      super(props);      
    }

    setCoordinate(location) {
        this._runCommand("setCoordinate", [location])
    }

    _getHandle() {
        return findNodeHandle(this.marker);
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
            //this.getMapManagerCommand(name)(this._getHandle(), ...args);
            this._mapManagerCommand(name)(this._getHandle(), ...args);
            break;
    
          default:
            break;
        }
      }

      _uiManagerCommand(name) {
        const UIManager = NativeModules.UIManager;
        const componentName = "RMFMarker";
    
        if (!UIManager.getViewManagerConfig) {
          // RN < 0.58
          return UIManager[componentName].Commands[name];
        }
    
        // RN >= 0.58        
        return UIManager.getViewManagerConfig(componentName).Commands[name];
      }
      
      _mapManagerCommand(name) {
        return NativeModules[`RMFMarker`][name];
      }

      render() {
        let icon = {};
        if (this.props.icon) {
          icon = Image.resolveAssetSource(this.props.icon) || {};
        }
        return <RMFMarker
          {...this.props}
          icon={icon.uri}
          ref={ref => { this.marker = ref; }}
          onPress={event => {
            event.stopPropagation();
            if (this.props.onPress) {
              this.props.onPress(event);
            }
          }}
        />;
      }
}

var RMFMarker = requireNativeComponent(`RMFMarker`, MFMarker);

export {MFMarker}
