## 3.0.0

Changed the approach to 3D mode.
Instead of requiring the 3D map type to render 3D objects, developers can now manually enable or disable 3D buildings via the `showsBuildings` property.
This feature is supported on both `roadmap` and `hybrid` map types, allowing full customization of the map style even when 3D rendering is enabled.

* Support set map style by `mapStyle` property of the `MFMapView`
* Add `hybrid` map type

### Breaking changes

* The map type `raster`, `map3D` has been removed
* The `enable3DMode` and `is3DMode` method has been removed from `MFMapView`. 3D buildings can now be shown using the `showsBuildings` property of the `MFMapView`
* The `onModeChange`, `onShouldChangeMapMode`, `onReachLimitedZoom` callback has been removed from the `MFMapView`

## 1.0.1

* [Android] Fix wrong custom view marker size on RN 0.79.x

## 1.0.0

* Initial package
