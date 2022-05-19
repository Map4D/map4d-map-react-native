import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Map4dMapView } from 'react-native-map4d-map';

export default function App() {
  return (
    <View style={styles.container}>
      <Map4dMapView color="#32a852" style={styles.box} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
