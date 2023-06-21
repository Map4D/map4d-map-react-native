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
} from 'react-native';

import { MFMapView } from 'react-native-map4d-map';
import { MFMarker } from 'react-native-map4d-map';

function App() {
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <MFMapView style={styles.container}
          camera={{
            center: { latitude: 16.072271, longitude: 108.226958 },
            zoom: 17,
            bearing: 0,
            tilt: 0,
          }}>
          <MFMarker
            coordinate={{
              latitude: 16.072271, longitude: 108.226958
            }}
            zIndex={3.0}
            draggable
            anchor={{ x: 0.5, y: 1.0 }}
            userData={{ name: 'Marker 3', arr: [1, 5, 9], obj: { x: 10, y: 11 } }}
            visible={true}
            style={{
              backgroundColor: '#ffff00',
            }}>
            <View style={{
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#00ff00',
              width: 100,
              height: 100
            }}>
              <Text style={{
                color: '#ff0000',
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
    alignItems: 'center', // must define this props for MFMapView style to get right value width for children View (example: Custom View Marker)
    justifyContent: 'center'
  },
});

export default App;