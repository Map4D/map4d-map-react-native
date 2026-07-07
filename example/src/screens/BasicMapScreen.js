import {MFMapView, MFBuilding} from 'react-native-map4d-map-dtqg'
import React from 'react'
import {SafeAreaView, StyleSheet, View, Text} from 'react-native'

function BasicMapScreen() {
  const camera = {latitude: 16.088377222167768, longitude: 108.22961691829235}

  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent)
  }

  const onPressBuilding = async (e) => {
    console.log('Press Building:', e.nativeEvent)
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <MFMapView
        style={styles.container}
        camera={{
          center: camera,
          zoom: 15,
          bearing: 0,
          tilt: 0,
        }}
        mapType="roadmap"
        onDataSourceFeaturePress={onDataSourceFeaturePress}
      >
        <MFBuilding
          onPress={onPressBuilding}
          coordinate={{
            latitude: 16.088377222167768,
            longitude: 108.22961691829235,
          }}
          modelUrl="https://maptile.s3-sgn10.fptcloud.com/sdk/models/5db6b4798b4711141457d8a9.obj"
          textureUrl="https://maptile.s3-sgn10.fptcloud.com/sdk/textures/5db6b4798b4711141457d8ab.jpg"
          name="Building test"
        />
      </MFMapView>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Basic Map</Text>
        <Text style={styles.infoText}>Pinch, pan va xoay de kiem tra tuong tac co ban.</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: '#eef2f7',
  },
  container: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 18,
  },
})

export default BasicMapScreen