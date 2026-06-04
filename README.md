# react-native-map4d-map-dtqg

Map4dMap DTQG SDK for React Native

## Installation

```sh
npm install react-native-map4d-map-dtqg
```

## Usage

```javascript
import {MFMapView} from 'react-native-map4d-map-dtqg';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

function App() {
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <MFMapView style={styles.container}/>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default App;
```

## AreaFocuser usage

```javascript
import {MFMapView} from 'react-native-map4d-map-dtqg';
import React, {useRef} from 'react';
import {Button, SafeAreaView} from 'react-native';

function App() {
  const mapRef = useRef(null);

  const onFocusWithHighlight = async () => {
    const areaFocuser = mapRef.current?.areaFocuser;
    if (!areaFocuser) return;

    await areaFocuser.focusProvince({
      name: 'Ha Noi',
      highlight: true,
    });
  };

  const onRemoveHighlight = async () => {
    const areaFocuser = mapRef.current?.areaFocuser;
    if (!areaFocuser) return;

    await areaFocuser.focusProvince(null);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Button title="Focus with highlight" onPress={onFocusWithHighlight} />
      <Button title="Remove highlight" onPress={onRemoveHighlight} />
      <MFMapView style={{flex: 1}} ref={mapRef} />
    </SafeAreaView>
  );
}
```

`focusProvince(options)` options:
- `name`: province name, example `Ha Noi`
- `highlight`: `true` to show a highlight polygon mask managed internally by `MFMapView`
- Pass `null` (or no `name`) to clear current highlight.

Examples:
- `focusProvince({ name: 'Ha Noi' })`
- `focusProvince({ name: 'Ha Noi', highlight: true })`
- `focusProvince(null)`
