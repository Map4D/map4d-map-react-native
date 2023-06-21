import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, Button } from 'react-native'
import { MFDirectionsRenderer, MFMapView } from 'react-native-map4d-map'
import { fetchDirections, MFTravelMode } from 'react-native-map4d-services';

const DirectionsScreen = ({ navigation, route }) => {

  const {startLocation, endLocation} = route.params;
  const [directions, setDirections] = useState('')
  const [activedIndex, setActivedIndex] = useState(0)

  const onMapReady = () => {
    map.moveCamera({
      center: startLocation.coordinate,
      zoom: 18
    })

    const animateCamera = async () => {
      let cam = await map.cameraForBounds({
        bounds: {
          northEast: endLocation.coordinate,
          southWest: startLocation.coordinate,
        }
      })
      map.animateCamera(cam)
    }

    fetchDirections({
      origin: startLocation.coordinate,
      destination: endLocation.coordinate,
      mode: MFTravelMode.car,
    })
    .then(response => {
      setDirections(JSON.stringify(response))
      animateCamera()
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MFMapView
        style={styles.container}
        ref={ref => map = ref}
        onMapReady={onMapReady}
        showsMyLocation={true}
      >
        <MFDirectionsRenderer
          directions={directions}
          activedIndex={activedIndex}
          onPress={(e) => setActivedIndex(e.nativeEvent.routeIndex)}
          originPOIOptions={{
            coordinate: startLocation.coordinate,
            title: startLocation.name
          }}
          destinationPOIOptions={{
            coordinate: endLocation.coordinate,
            title: endLocation.name
          }}
        />
      </MFMapView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default DirectionsScreen
