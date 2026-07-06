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

## AreaFocus usage

```javascript
import {MFMapView} from 'react-native-map4d-map-dtqg';
import React, {useRef} from 'react';
import {Button, SafeAreaView} from 'react-native';

function App() {
  const mapRef = useRef(null);

  const onFocusProvinceByName = async () => {
    const mapView = mapRef.current;
    if (!mapView) return;

    await mapView.focusArea({
      type: 'province',
      name: 'Ha Noi',
      display: 'highlight',
    });
  };

  const onFocusProvinceById = async () => {
    const mapView = mapRef.current;
    if (!mapView) return;

    await mapView.focusArea({
      type: 'province',
      id: 30,
      display: 'normal',
    });
  };

  const onFocusIndustrial = async () => {
    const mapView = mapRef.current;
    if (!mapView) return;

    await mapView.focusArea({
      type: 'industrialZone',
      id: 2,
      display: 'normal',
    });
  };

  const onFocusEconomic = async () => {
    const mapView = mapRef.current;
    if (!mapView) return;

    await mapView.focusArea({
      type: 'economicZone',
      id: 2,
      display: 'highlight',
    });
  };

  const onClear = async () => {
    const mapView = mapRef.current;
    if (!mapView) return;

    mapView.clearFocusedArea();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Button title="Province (name) highlight" onPress={onFocusProvinceByName} />
      <Button title="Province (id)" onPress={onFocusProvinceById} />
      <Button title="Industrial" onPress={onFocusIndustrial} />
      <Button title="Economic highlight" onPress={onFocusEconomic} />
      <Button title="Clear" onPress={onClear} />
      <MFMapView style={{flex: 1}} ref={mapRef} />
    </SafeAreaView>
  );
}
```

`focusArea(focusOptions)` options:
- `focusOptions.type`: required, accepts string or numeric type:
  - Province: `'province'`
  - Industrial/economic aliases: `'industrialZone' | 'economicZone' | 'ecoIndustrialZone' | 'freeTradeZone' | 'nonTariffZone' | 'otherZoneModel'`
- `focusOptions.id`: optional for province, required for industrial/economic types
- `focusOptions.name`: optional province name (used when province `id` is not provided)
- `focusOptions.display`: `'normal' | 'highlight'` (default `'normal'`)
- `focusOptions.padding`: optional camera padding `{left, right, top, bottom}`

Examples:
- `focusArea({ type: 'province', name: 'Ha Noi' })`
- `focusArea({ type: 'province', id: 1, display: 'highlight' })`
- `focusArea({ type: 'industrialZone', id: 2, display: 'normal', padding: { top: 80, right: 0, bottom: 0, left: 80 } })`
- `focusArea({ type: 'economicZone', id: 2, display: 'highlight' })`
- `focusArea({ type: 'freeTradeZone', id: 10 })`
- `focusArea({ type: IndustrialEconomicType.NON_TARIFF_ZONE, id: 11 })`
- `clearFocusedArea()` to clear current focus
