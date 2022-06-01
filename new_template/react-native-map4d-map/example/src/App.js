import {MFMapView, MFMarkerCluster, MFClusterItem} from 'react-native-map4d-map';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

function App() {
  const maxClusterItemCount = 500
  const camera = {latitude: 16.0432432, longitude: 108.032432}
  const extent = 0.2
  
  let _randomScale = () => {
    return Math.random() * 2.0 - 1.0
  }

  let _generateClusterItems = () => {
    let items = []
    for (let index = 1; index <= maxClusterItemCount; ++index) {
      let lat = camera.latitude + extent * _randomScale()
      let lng = camera.longitude + extent * _randomScale()
      items.push(
        <MFClusterItem
          key={index}
          coordinate={{latitude: lat, longitude: lng}}
          title={`Cluster Item ${index}`}
          onPress={(e) => console.log(`Tap at cluster item ${index}:`, e.nativeEvent)}
          onPressInfoWindow={(e) => console.log(`Tap at cluster item ${index} info window:`, e.nativeEvent)}
        />
      )
    }
    return items
  }

  const items = _generateClusterItems()

  const onPressCluster = async (e) => {
    console.log('Press on cluster:', e.nativeEvent)
    let cluster = e.nativeEvent.cluster
    let camera = await map.getCamera()
    camera.center = cluster.location
    camera.zoom = camera.zoom + 1
    map.animateCamera(camera)
  }
  
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <MFMapView style={styles.container}
          camera={{
            center: camera,
            zoom: 10,
            bearing: 0,
            tilt: 0,
          }}
          ref={ref => map = ref}
        >
          <MFMarkerCluster onPressCluster={onPressCluster}>
            {items}
          </MFMarkerCluster>
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