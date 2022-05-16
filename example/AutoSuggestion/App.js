import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  StyleSheet,
  View,
  FlatList,
  TextInput,
} from 'react-native';

import { MFMapView, MFMarker } from 'react-native-map4d-map';
import { fetchSuggestion } from 'react-native-map4d-services';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [markerCoordinate, setMarkerCoordinate] = useState({latitude: 0, longitude: 0});
  const [markerVisible, setMarkerVisible] = useState(false);

  const onChangeTextSearch = (text) => {
    if (text) {
      /** Fetch Map4dServices Auto Suggestion */
      fetchSuggestion({text: text})
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

  const getMyLocation = async () => {
    let location = await this.map.getMyLocation()
    console.log('My Location:', location)
    alert('My Location: ' + JSON.stringify(location.coordinate, null, 2))
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
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => onChangeTextSearch(text)}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
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
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#fff',
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
