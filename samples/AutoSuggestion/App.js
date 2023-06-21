import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  StyleSheet,
  View,
  FlatList,
  PermissionsAndroid,
  Platform,
  TextInput,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { MFMapView, MFMarker } from 'react-native-map4d-map';
import { fetchSuggestion } from 'react-native-map4d-services';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [markerCoordinate, setMarkerCoordinate] = useState({latitude: 0, longitude: 0});
  const [markerVisible, setMarkerVisible] = useState(false);
  const [useMyLocation, setUseMyLocation] = useState(true)

  const onChangeTextSearch = async (text) => {
    if (text) {
      let location = undefined
      if (useMyLocation) {
        location = await getMyLocationFromMap4d()
      }

      /** Fetch Map4dServices Auto Suggestion */
      fetchSuggestion({text: text, location: location})
      .then((response) => {
        if (response.code == 'ok') {
          setSearchResults(response.result);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      setSearchResults([]);
      setMarkerVisible(false)
    }
  };

  const getMyLocationFromMap4d = async () => {
    let location = null
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location. Please turn on device location',
            buttonPositive: "OK"
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          location = await this.map.getMyLocation()
        }
      }
      catch (err) {
        console.warn(err)
      }
    }
    else {
      location = await this.map.getMyLocation()
    }
    if (location) {
      return location.coordinate
    }
    alert('Please set "showsMyLocation" props = true & enable permission to use location')
  }

  const getMyLocation = async () => {
    let location = await getMyLocationFromMap4d()
    console.log('My Location:', location)
    if (location) {
      alert(`My Location: {latitude: ${location.latitude}, longitude: ${location.longitude}}`)
    }
  }

  const ItemView = ({ item }) => {
    return (
      <Text style={styles.itemStyle} onPress={() => selectItem(item)}>
        {item.name}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const selectItem = (item) => {
    let location = {
      latitude: item.location.lat,
      longitude: item.location.lng
    }
    this.map.moveCamera({
      center: location,
      zoom: 16
    })
    setMarkerCoordinate(location)
    setMarkerVisible(true)
    setSearchResults([])
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MFMapView
        style={styles.container}
        ref={ref => this.map = ref}
        showsMyLocation={true}
        // showsMyLocationButton={true}
      >
        <MFMarker
          coordinate={markerCoordinate}
          visible={markerVisible}
        />
      </MFMapView>
      <View style={styles.searchList}>
        <View style={styles.checkboxContainer}>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => onChangeTextSearch(text)}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
          <CheckBox style={styles.checkbox} value={useMyLocation} onValueChange={setUseMyLocation} boxType={"square"}/>
          <Text style={styles.label}>Nearby</Text>
        </View>
        <FlatList style={{backgroundColor: '#fff'}}
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
      <View style={styles.bottomButton}>
        <Button title='MY LOCATION' color='#fff' onPress={getMyLocation}></Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    width: 250,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: "row",
  },
  checkbox: {
    margin: 8,
    alignSelf: "center",
  },
  label: {
    margin: 8,
    alignSelf: "center",
  },
  searchList: {
    marginTop: 50,
    width: '100%',
    position: 'absolute',
  },
  bottomButton: {
    position: 'absolute',
    marginBottom: 50,
    bottom: 0,
    marginRight: 30,
    right: 0,
    backgroundColor: '#f194ff'
  },
});

export default App;
