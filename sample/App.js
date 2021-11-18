import {
  MFMapView,
  MFDirectionsRenderer
} from 'react-native-map4d-map';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

function App() {
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <MFMapView style={styles.container}
        camera={{
          center: { latitude: 16.077491, longitude: 108.221735 },
          zoom: 16,
          bearing: 0,
          tilt: 0,
        }}
        >
          <MFDirectionsRenderer
            ref={ref => this.directions = ref}
            routes={[
              [
                { latitude: 16.078814, longitude: 108.221592 },
                { latitude: 16.078972, longitude: 108.223034 },
                { latitude: 16.075353, longitude: 108.223513 },
              ],
              [
                { latitude: 16.078814, longitude: 108.221592 },
                { latitude: 16.077491, longitude: 108.221735 },
                { latitude: 16.077659, longitude: 108.223212 },
                { latitude: 16.075353, longitude: 108.223513 }
              ]
            ]}
            activedIndex={1}
            activeStrokeWidth={10}
            activeStrokeColor="#edf75c"
            activeOutlineWidth={2}
            activeOutlineColor="#e3b314"
            inactiveStrokeWidth={10}
            inactiveStrokeColor="#3d1294"
            inactiveOutlineWidth={1}
            inactiveOutlineColor="#1f113b"
            originPOIOptions={{
              coordinate: { latitude: 16.079774, longitude: 108.220534 },
              title: "Begin Position",
              titleColor: "#ff0000",
              icon:{ uri: require('./assets/marker-pink.png') },
              visible: true
            }}
            destinationPOIOptions={{
              title: "End",
              titleColor: "#0c4503",
              icon:{ uri: require('./assets/marker-green.png') },
              visible: true
            }}
            onPress={
              (event) => {
                console.log("Press Directions Renderer:", event.nativeEvent)
                this.directions.setActivedIndex(event.nativeEvent.routeIndex)
              }
            }
          />
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