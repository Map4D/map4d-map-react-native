import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
} from 'react-native';

import { fetchSuggestion } from 'react-native-map4d-services';

var startLocation = null
var endLocation = null

const SelectLocationScreen = ({ navigation, route }) => {
  const { myAddress, myLocation } = route.params
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [isSelectStart, setSelectStart] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (myLocation && myAddress) {
      startLocation = { coordinate: myLocation, name: myAddress }
      setStartAddress(myAddress)
    }
    return () => { startLocation = null; endLocation = null; }
  }, []);

  const onChangeTextSearch = async (text) => {
    if (text) {
      /** Fetch Map4dServices Auto Suggestion */
      fetchSuggestion({text: text, location: myLocation})
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
    }
    setSearch(text)
  };

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

  const setSearch = (text) => {
    if (isSelectStart) {
      setStartAddress(text)
    }
    else {
      setEndAddress(text)
    }
  }

  const setLocation = (location) => {
    if (isSelectStart) {
      startLocation = location
    }
    else {
      endLocation = location
    }

    if (startLocation && endLocation) {
      navigation.replace("Directions", {
        startLocation: startLocation,
        endLocation: endLocation
      })
    }
  }

  const selectItem = (item) => {
    setSearch(item.name + ", " + item.address)
    setSearchResults(isSelectStart, [])

    let location = {
      name: item.name,
      coordinate: {
        latitude: item.location.lat,
        longitude: item.location.lng
      }
    }
    setLocation(location)
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          value={startAddress}
          onPressIn={() => setSelectStart(true)}
          onChangeText={(text) => onChangeTextSearch(text)}
          underlineColorAndroid="transparent"
          placeholder="Gặp tôi ở ..."
        />
        <TextInput
          style={styles.textInputStyle}
          value={endAddress}
          onPressIn={() => setSelectStart(false)}
          onChangeText={(text) => onChangeTextSearch(text)}
          underlineColorAndroid="transparent"
          placeholder="Tôi muốn đến ..."
        />
        <FlatList style={{backgroundColor: '#fff'}}
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
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
});

export default SelectLocationScreen