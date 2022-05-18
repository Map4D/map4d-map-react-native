import Geolocation from '@react-native-community/geolocation'
import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, Button, Image, Text } from 'react-native'
import { MFMapView, MFMarker } from 'react-native-map4d-map'

const HomeScreen = ({ navigation }) => {
  const [myLocationCoordinate, setMyLocationMarkerCoordinate] = useState({latitude: 0, longitude: 0})
  const markerIcon = require("./assets/marker.png")

  const onMapReady = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        this.map.moveCamera({
          center: location
        })
        setMyLocationMarkerCoordinate(location)
      },
      (error) => { console.warn(error) },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MFMapView
        style={styles.container}
        ref={ref => this.map = ref}
        onMapReady={onMapReady}
      >
        <MFMarker
          coordinate={myLocationCoordinate}
          icon={{uri: markerIcon, width: 60, height: 60}}
        >
        </MFMarker>
      </MFMapView>
      <View style={styles.content}>
        <View style={styles.selectLocation}>
          <Button title="Bạn muốn đi đâu?" onPress={() => navigation.navigate("SelectLocation", { location: myLocationCoordinate})}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    flex: 1,
    marginTop: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectLocation: {
    width: '90%',
    backgroundColor: '#fff'
  },
})

export default HomeScreen
