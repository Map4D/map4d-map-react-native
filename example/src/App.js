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

  const onFocusProvince = async (highlight) => {
    const areaFocuser = mapRef.current?.areaFocuser
    if (!areaFocuser) {
      return
    }

    await areaFocuser.focusProvince({
      name: 'Ha Noi',
      highlight: highlight,
    })
  }

  const onRemoveHighlight = async () => {
    const areaFocuser = mapRef.current?.areaFocuser
    if (!areaFocuser) {
      return
    }

    await areaFocuser.focusProvince(null)
  }

  const onFocusIndustrialZone = async () => {
    const areaFocuser = mapRef.current?.areaFocuser
    if (!areaFocuser) {
      return
    }

    await areaFocuser.focus({
      id: 2,
      type: 'industrial',
      display: 'normal',
    })
  }

  const onFocusIndustrialZoneHighlight = async () => {
    const areaFocuser = mapRef.current?.areaFocuser
    if (!areaFocuser) {
      return
    }

    await areaFocuser.focus({
      id: 2,
      type: 'industrial',
      display: 'highlight',
    })
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <Button title="Focus with highlight" onPress={() => onFocusProvince(true)} />
      <Button title="Focus no highlight" onPress={() => onFocusProvince(false)} />
      <Button title="Remove highlight" onPress={onRemoveHighlight} />
      <Button title="Focus industrial zone" onPress={onFocusIndustrialZone} />
      <Button title="Focus industrial zone highlight" onPress={onFocusIndustrialZoneHighlight} />
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