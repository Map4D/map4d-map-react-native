import {MFMapView} from 'react-native-ipostmap';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

function App() {
  const camera = {latitude: 16.0432432, longitude: 108.032432}

  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent)
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
          mapID="640e89aec8234317030377f9"
          onDataSourceFeaturePress={onDataSourceFeaturePress}
        >
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