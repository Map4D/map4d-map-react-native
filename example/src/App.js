import {MFMapView, MFBuilding} from 'react-native-map4d-map-dtqg'
import React, {useRef} from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Button,
} from 'react-native'

function App() {
  const mapRef = useRef(null)

  const camera = {
    latitude: 16.103254,
    longitude: 108.214835,
  }

  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent)
  }

  const onPressBuilding = async (e) => {
    console.log('Press Building:', e.nativeEvent)
  }

  const focusByOptions = async (options) => {
    const mapView = mapRef.current
    if (!mapView || typeof mapView.focusArea !== 'function') {
      return
    }

    await mapView.focusArea(options)
  }

  const onClearFocus = async () => {
    const mapView = mapRef.current
    if (!mapView || typeof mapView.clearFocusedArea !== 'function') {
      return
    }

    mapView.clearFocusedArea()
  }

  const onFocusIndustrialZone = async (highlight) => {
    await focusByOptions({
      id: 2,
      type: 'industrialZone',
      display: highlight ? 'highlight' : 'normal',
    })
  }

  const onFocusEconomicZone = async (highlight) => {
    await focusByOptions({
      id: 2,
      type: 'economicZone',
      display: highlight ? 'highlight' : 'normal',
      padding: {
        left: 100,
        right: 0,
        top: 100,
        bottom: 0,
      },
    })
  }

  const onFocusProvinceById = async (highlight) => {
    await focusByOptions({
      type: 'province',
      id: 30,
      display: highlight ? 'highlight' : 'normal',
    })
  }

  const onFocusProvinceByName = async (highlight) => {
    const areaFocuser = mapRef.current?.areaFocuser
    if (!areaFocuser) {
      return
    }

    await areaFocuser.focusProvince({
      name: 'Ha Noi',
      highlight: true,
    })
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <Button title="Focus province by name with highlight" onPress={() => onFocusProvinceByName(true)} />
      <Button title="Focus province by id" onPress={() => onFocusProvinceById(false)} />
      <Button title="Focus province by id highlight" onPress={() => onFocusProvinceById(true)} />
      <Button title="Focus industrial zone" onPress={() => onFocusIndustrialZone(false)} />
      <Button title="Focus industrial zone highlight" onPress={() => onFocusIndustrialZone(true)} />
      <Button title="Focus economic zone" onPress={() => onFocusEconomicZone(false)} />
      <Button title="Focus economic zone highlight" onPress={() => onFocusEconomicZone(true)} />
      <Button title="Clear focus" onPress={onClearFocus} />
      <MFMapView
        style={styles.container}
        camera={{
          center: camera,
          zoom: 17,
          bearing: 0,
          tilt: 0,
        }}
        mapType="roadmap"
        ref={mapRef}
        onDataSourceFeaturePress={onDataSourceFeaturePress}
      >
        <MFBuilding
          onPress={onPressBuilding}
          coordinate={{
            latitude: 16.103254,
            longitude: 108.214835,
          }}
          modelUrl="https://maptile.s3-sgn10.fptcloud.com/sdk/models/5db6b4798b4711141457d8a9.obj"
          textureUrl="https://maptile.s3-sgn10.fptcloud.com/sdk/textures/5db6b4798b4711141457d8ab.jpg"
          name="Building test"
        />
      </MFMapView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
})

export default App