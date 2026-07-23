import { MFBanDoSo } from 'react-native-map4d-map-dtqg';
import React from 'react';
import { StyleSheet } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const INITIAL_CAMERA = {
  center: {
    latitude: 16.157436,
    longitude: 106.243699,
  },
  zoom: 6,
  bearing: 0,
  tilt: 0,
};

function BanDoSoScreen() {
  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <MFBanDoSo
        style={styles.container}
        camera={INITIAL_CAMERA}
        mapType="roadmap"
        onDataSourceFeaturePress={onDataSourceFeaturePress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default BanDoSoScreen;
