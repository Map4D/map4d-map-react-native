import React, {useRef} from 'react'
import {StyleSheet, Button} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {MFMapView} from 'react-native-map4d-map-dtqg'

function FocusAreaScreen() {
  const mapRef = useRef(null)

  const camera = {latitude: 16.088377222167768, longitude: 108.22961691829235}

  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent)
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
    
    await mapView.clearFocusedArea()
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

  const actions = [
    {
      key: 'province-name-highlight',
      title: 'Focus province by name with highlight',
      onPress: () => onFocusProvinceByName(true),
    },
    {
      key: 'province-id',
      title: 'Focus province by id',
      onPress: () => onFocusProvinceById(false),
    },
    {
      key: 'province-id-highlight',
      title: 'Focus province by id highlight',
      onPress: () => onFocusProvinceById(true),
    },
    {
      key: 'industrial-zone',
      title: 'Focus industrial zone',
      onPress: () => onFocusIndustrialZone(false),
    },
    {
      key: 'industrial-zone-highlight',
      title: 'Focus industrial zone highlight',
      onPress: () => onFocusIndustrialZone(true),
    },
    {
      key: 'economic-zone',
      title: 'Focus economic zone',
      onPress: () => onFocusEconomicZone(false),
    },
    {
      key: 'economic-zone-highlight',
      title: 'Focus economic zone highlight',
      onPress: () => onFocusEconomicZone(true),
    },
    {
      key: 'clear-focus',
      title: 'Clear focus',
      onPress: onClearFocus,
    },
  ]

  return (
    <SafeAreaView style={styles.safeView}>
      {actions.map((action) => (
        <Button key={action.key} title={action.title} onPress={action.onPress} />
      ))}
      <MFMapView
        style={styles.container}
        camera={{
          center: camera,
          zoom: 14,
          bearing: 0,
          tilt: 0,
        }}
        mapType="roadmap"
        ref={mapRef}
        onDataSourceFeaturePress={onDataSourceFeaturePress}
      >
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

export default FocusAreaScreen
