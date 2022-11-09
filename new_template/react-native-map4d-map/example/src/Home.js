import Geolocation from '@react-native-community/geolocation'
import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, Button, Image, Text } from 'react-native'
import { MFMapView, MFMarker, MFPOI, MFCircle } from 'react-native-map4d-map'

const HomeScreen = ({ navigation, route }) => {
  const [myLocationCoordinate, setMyLocationMarkerCoordinate] = useState({latitude: 16.071985, longitude: 108.225362})
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [myAddress, setMyAddress] = useState("")
  const markerIcon = require("../assets/marker.png")

  const getCurrentPositionAddress = (location) => {
    console.error("0000000000000000000000000000000")
  }

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
        getCurrentPositionAddress(location)
      },
      (error) => { console.error(error) },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 1000
      },
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MFMapView
        style={styles.container}
        ref={ref => this.map = ref}
        showsMyLocation={true}
        onMapReady={onMapReady}
      >
        {/* <MFMarker
          coordinate={myLocationCoordinate}
          // icon={{uri: markerIcon, width: 60, height: 60}}
        >
        </MFMarker> */}

        {/* <MFPOI ref={ref => this.poi = ref}
          coordinate={myLocationCoordinate}
          title="Map4D React-Native"
          titleColor="#FF0000"
          poiType="park"
        /> */}

      <MFCircle
        center={myLocationCoordinate}
        radius={50}
        visible={true}
        fillColor="#F00FF07F"
        strokeColor="#0000FF08" strokeWidth={2}
        zIndex ={3.0} />

      </MFMapView>
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
