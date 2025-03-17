import {MFMapView, MFBuilding} from 'react-native-map4d-map';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

function App() {
  const camera = {latitude: 16.103254, longitude: 108.214835}

  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent)
  }

  
  const onPressBuilding = async (e) => {
    console.log('Press Building:', e.nativeEvent)
  }

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <MFMapView style={styles.container}
          camera={{
            center: camera,
            zoom: 17,
            bearing: 0,
            tilt: 0,
          }}
          mapType='map3d'
          ref={ref => map = ref}
          onDataSourceFeaturePress={onDataSourceFeaturePress}
        >
          <MFBuilding
            onPress={onPressBuilding}
            coordinate={{
              latitude: 16.103254,
              longitude: 108.214835,
            }}
            modelUrl="https://hcm03.vstorage.vngcloud.vn/v1/AUTH_b32b6bc102c44269ab7b55e7820e7116/sdk/models/5db6b4798b4711141457d8a9.obj"
            textureUrl="https://hcm03.vstorage.vngcloud.vn/v1/AUTH_b32b6bc102c44269ab7b55e7820e7116/sdk/textures/5db6b4798b4711141457d8ab.jpg"
            name="Building test"
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