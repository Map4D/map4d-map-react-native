# react-native-map4d-map-dtqg

Map4dMap DTQG SDK for React Native

## Installation

```sh
npm install react-native-map4d-map-dtqg
```

## TurboModule compatibility

This library supports React Native New Architecture module resolution for `Map4dMap` by using `TurboModuleRegistry` with automatic fallback to `NativeModules`.

The package now also includes a TurboModule codegen spec (`src/specs/NativeMap4dMap.js`) and `codegenConfig` in `package.json` so React Native apps can generate module bindings in New Architecture builds.

What this means:
- On React Native apps with New Architecture enabled, map native module lookup works with TurboModule resolution.
- On older React Native versions, the library keeps using legacy bridge resolution.
- No public JavaScript API changes are required for existing apps.
- Native `Map4dMap` APIs (`getCamera`, `getBounds`, `getMyLocation`, `pointForCoordinate`, `coordinateForPoint`, `cameraForBounds`) are implemented in both Android and iOS modules to align with the TurboModule spec.

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

## MFBanDoSo usage

`MFBanDoSo` extends `MFMapView`. It fetches a category config from a fixed internal URL, lets the user toggle which categories are shown, and syncs the resulting GeoJSON style to the map against a fixed internal vector tile source. Both URLs are internal to the SDK (only the `/staging` path segment can be toggled via `isStaging`) and are not otherwise configurable via props. It renders its own layer-selector and legend UI on top of the map — there is no prop to disable or reposition this UI.

```javascript
import {MFBanDoSo} from 'react-native-map4d-map-dtqg';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

const INITIAL_CAMERA = {
  center: {latitude: 16.157436, longitude: 106.243699},
  zoom: 6,
  bearing: 0,
  tilt: 0,
};

function App() {
  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent);
  };

  return (
    <SafeAreaView style={styles.safeView} edges={['left', 'right', 'bottom']}>
      <MFBanDoSo
        style={styles.container}
        camera={INITIAL_CAMERA}
        mapType="roadmap"
        onDataSourceFeaturePress={onDataSourceFeaturePress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {flex: 1},
  container: {flex: 1},
});

export default App;
```

Props:
- `isStaging`: optional `boolean`, default `true`. Selects between the staging and production API for both the category config and vector tile source (toggles the `/staging` path segment on the fixed internal host). Pass `isStaging={false}` to use production.
- Otherwise no `MFBanDoSo`-specific props — the category config URL and vector tile source URL are fixed internally by the SDK.
- All `MFMapView` props (`camera`, `mapType`, `mapStyle`, `onDataSourceFeaturePress`, etc.) and children (e.g. `MFBuilding`, `MFMarker`) are supported the same way as on `MFMapView`.
