/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  Button,
  NativeModules,
} from 'react-native';

import {MFMapView} from './components/MFMapView'
import {MFMarker} from './components/MFMarker'
import {MFCircle} from './components/MFCircle'
import {MFPolyline} from './components/MFPolyline'
import {MFPOI} from './components/MFPOI'

import MapScreen from './MapScreen'


// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
const { Navigation } = require('react-native-navigation');


function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}
Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Map', () => MapScreen);

// const Stack = createStackNavigator();

//From NPM
/*
import {MFMapView, MFMarker, MFCircle, MFPolyline} from 'react-native-map4d-map'
*/

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Map">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Map" component={MapScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;

export default class App {
  constructor() {
    const stack = {
      id:'AppStack',
      children:[
          {
              component: {
                  name: 'Map'
              },
              passProps: null,
          }
      ],
      options: {
          topBar: {
              visible: false,
              drawBehind: true,
              animate: true,
          }
      }
  }
  // NavigationManager.addComponentId(stack.children[0].component.name)
  Navigation.events().registerAppLaunchedListener(async () => {
    Navigation.setRoot({
      root: {
        stack
      }
    });
  });
}
}

