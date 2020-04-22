// ImageView.js
import React from 'react';
import {requireNativeComponent, Platform, NativeModules, findNodeHandle} from 'react-native';


class MFMapView extends React.Component {
    constructor(props) {
      super(props);      
    }

    _getHandle() {
        return findNodeHandle(this.map);
      }

    getCamera() {
        if (Platform.OS === 'android') {
            return NativeModules.Map4dMap.getCamera(this._getHandle());
        } else {
            console.log("Not implemented")
            return null
        }
    }

    animateCamera(camera) {
        console.log(camera);
        this._runCommand('animateCamera', [camera]);
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
            //return this._mapManagerCommand(name)(this._getHandle(), ...args);
            console.log("not implemented")
    
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
    
    
    render() {
      return <RMFMapView {...this.props} ref={ref => {
        this.map = ref;
      }}/>;
    }
  }  
  
var RMFMapView = requireNativeComponent(`RMFMapView`);


export default MFMapView