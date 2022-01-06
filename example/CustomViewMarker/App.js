/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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

import {MFMapView} from 'react-native-map4d-map';
import {MFMarker} from 'react-native-map4d-map';

function App() {
  return (
    <>
      <SafeAreaView style={styles.safeView}
	  camera={{
            center: { latitude: 10.7881732, longitude: 106.7000933 },
            // center: { latitude: 16.077491, longitude: 108.221735 },
            // center: {latitude: 10.7881732, longitude: 106.7000933},
            zoom: 17,
            bearing: 0,
            tilt: 0,
          }}
	  >
        <MFMapView style={styles.container}>
		
			<MFMarker
          coordinate={{
            latitude: 10.788482, longitude: 106.699555
          }}
          zIndex={3.0}
          draggable
          anchor={{ x: 0.5, y: 1.0 }}
          userData={{ name: 'Marker 3', arr: [1, 5, 9], obj: { x: 10, y: 11 } }}
          visible={true}
        >
          <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            width: 100,
            height: 100
          }}>
            <Text style={{
              color: '#00ff00',
              textAlign: 'center',
              marginBottom: 5
            }}>
              Địa chỉ giao hàng
            </Text>
            <Image
              source={require('./assets/marker-pink.png')}
              style={{
                height: 60,
                width: 60
              }}
            />
          </View>
        </MFMarker>
		</MFMapView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default App;