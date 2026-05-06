## 3.0.0

Changed the approach to 3D mode.
Instead of requiring the 3D map type to render 3D objects, developers can now manually enable or disable 3D buildings via the `showsBuildings` property.
This feature is supported on both `roadmap` and `hybrid` map types, allowing full customization of the map style even when 3D rendering is enabled.

* Support set map style by `mapStyle` property of the `MFMapView`
* Add `hybrid` map type

### Breaking changes

* The map type `raster`, `map3D` has been removed
* The `onModeChange`, `onShouldChangeMapMode`, `onReachLimitedZoom` callback has been removed from the `MFMapView`

## 2.8.0

* [iOS] Remove bitcode
* [iOS] Support iOS >= 11

## 2.7.0

* Add mapID prop & onDataSourceFeaturePress callback
* Update version Map4dMap SDK to 2.6+

## 2.6.3

### Changed

* Change ViewPropTypes, ColorPropType export from deprecated prop types

## 2.6.2

### Fixed

* [Android] Update to avoid error when build example for react native map4d map sdk
* [Android] Fixed crash app because mapNative was detroyed before removed child Annotations

### 2.6.1

### Fixed

* Fixed crash when long press on cluster item

## 2.6.0

### Changed

* Update version Map4dMap SDK to 2.4+