package vn.map4d.react.map;

import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.view.ViewTreeObserver;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.ReadableMap;

import java.util.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import vn.map4d.map.core.*;
import vn.map4d.map.camera.*;
import vn.map4d.map.annotations.*;
import vn.map4d.types.MFLocationCoordinate;

public class RMFMapView extends MFMapView implements OnMapReadyCallback  {

  public Map4D map;

  private RMFMapViewManager manager;
  private final List<RMFFeature> features = new ArrayList<>();
  private final Map<MFMarker, RMFMarker> markerMap = new HashMap<>();
  private final Map<MFCircle, RMFCircle> circleMap = new HashMap<>();
  private final Map<MFPolyline, RMFPolyline> polylineMap = new HashMap<>();
  private final Map<MFPolygon, RMFPolygon> polygonMap = new HashMap<>();
  private final Map<Long, RMFPOI> poiMap = new HashMap<>();

  private ViewAttacherGroup attacherGroup;

  public RMFMapView(Context context, RMFMapViewManager manager) {
    super(context, null);
    this.manager = manager;
    this.getMapAsync(this);

    // Set up a parent view for triggering visibility in subviews that depend on it.
    // Mainly ReactImageView depends on Fresco which depends on onVisibilityChanged() event
    attacherGroup = new ViewAttacherGroup(context);
    LayoutParams attacherLayoutParams = new LayoutParams(0, 0);
    attacherLayoutParams.width = 0;
    attacherLayoutParams.height = 0;
    attacherLayoutParams.leftMargin = 99999999;
    attacherLayoutParams.topMargin = 99999999;
    attacherGroup.setLayoutParams(attacherLayoutParams);
    addView(attacherGroup);
  }

  @Override
  public void onMapReady(Map4D map) {
    this.map = map;
    final RMFMapView view = this;

    manager.pushEvent(getContext(), this, "onMapReady", new WritableNativeMap());

    map.setOnMarkerDragListener((new Map4D.OnMarkerDragListener() {
      @Override
      public void onMarkerDrag(MFMarker marker) {
        RMFMarker rctMarker = markerMap.get(marker);
        if (rctMarker == null) {
          return;
        }

        //Event for MFMapView
        WritableMap event = getMarkerEventData(marker);
        event.putString("action", "marker-drag");
        manager.pushEvent(getContext(), view, "onMarkerDrag", event);
        
        //Event for MFMarker
        event = getMarkerEventData(marker);
        event.putString("action", "marker-drag");
        manager.pushEvent(getContext(), rctMarker, "onDrag", event);
      }

      @Override
      public void onMarkerDragEnd(MFMarker marker) {
        RMFMarker rctMarker = markerMap.get(marker);
        if (rctMarker == null) {
          return;
        }
        WritableMap event = getMarkerEventData(marker);
        event.putString("action", "marker-drag-end");
        manager.pushEvent(getContext(), view, "onMarkerDrag", event);

        event = getMarkerEventData(marker);
        event.putString("action", "marker-drag-end");
        manager.pushEvent(getContext(), rctMarker, "onDragEnd", event);
      }

      @Override
      public void onMarkerDragStart(MFMarker marker) {
        RMFMarker rctMarker = markerMap.get(marker);
        if (rctMarker == null) {
          return;
        }
        WritableMap event = getMarkerEventData(marker);
        event.putString("action", "marker-drag-start");
        manager.pushEvent(getContext(), view, "onMarkerDrag", event);

        event = getMarkerEventData(marker);
        event.putString("action", "marker-drag-start");
        manager.pushEvent(getContext(), rctMarker, "onDragStart", event);
      }
    }));

    map.setOnMarkerClickListener(new Map4D.OnMarkerClickListener() {
      @Override
      public boolean onMarkerClick(MFMarker marker) {
        RMFMarker rctMarker = markerMap.get(marker);
        if (rctMarker == null) {
          return false;
        }
        WritableMap event = getMarkerEventData(marker);
        event.putString("action", "marker-press");
        manager.pushEvent(getContext(), view, "onMarkerPress", event);

        event = getMarkerEventData(marker);
        event.putString("action", "marker-press");
        manager.pushEvent(getContext(), rctMarker, "onPress", event);
        return true;
      }
    });

    map.setOnPolylineClickListener(new Map4D.OnPolylineClickListener() {
      @Override
      public void onPolylineClick(MFPolyline polyline) {
        RMFPolyline rctPolyline = polylineMap.get(polyline);
        if (rctPolyline == null) {
          return;
        }
        WritableMap event = getPolylineEventData(polyline);
        event.putString("action", "polyline-press");
        manager.pushEvent(getContext(), rctPolyline, "onPress", event);
      }
    });

    map.setOnPolygonClickListener(new Map4D.OnPolygonClickListener() {
      @Override
      public void onPolygonClick(final MFPolygon polygon) {
        RMFPolygon rctPolygon = polygonMap.get(polygon);
        if (rctPolygon == null) {
          return;
        }
        WritableMap event = getPolygonEventData(polygon);
        event.putString("action", "polygon-press");
        manager.pushEvent(getContext(), rctPolygon, "onPress", event);
      }
    });

    map.setOnCircleClickListener(new Map4D.OnCircleClickListener() {
      @Override
      public void onCircleClick(MFCircle circle) {
        RMFCircle rctCircle = circleMap.get(circle);
        if (rctCircle == null) {
          return;
        }

        WritableMap event = getCircleEventData(circle);
        event.putString("action", "circle-press");
        manager.pushEvent(getContext(), rctCircle, "onPress", event);
      }
    });

    map.setOnUserPOIClickListener(new Map4D.OnUserPOIClickListener() {
      @Override
      public void onUserPOIClick(MFPOI poi) {
        RMFPOI rctPOI = poiMap.get(poi.getId());
        if (rctPOI == null) {
          return;
        }

        WritableMap event = getPOIEventData(poi);
        event.putString("action", "user-poi-press");
        manager.pushEvent(getContext(), rctPOI, "onPress", event);
      }
    });

    map.setOnPOIClickListener(new Map4D.OnPOIClickListener() {
      @Override
      public void onPOIClick(String placeId, String title, MFLocationCoordinate location) {
        WritableMap event = new WritableNativeMap();
        WritableMap locationMap = new WritableNativeMap();
        locationMap.putDouble("latitude", location.getLatitude());
        locationMap.putDouble("longitude", location.getLongitude());
        event.putMap("coordinate", locationMap);
        event.putString("placeId", placeId);
        event.putString("title", title);
        event.putString("action", "map-poi-press");
        manager.pushEvent(getContext(), view, "onPoiPress", event);
      }
    });

    map.setOnBuildingClickListener(new Map4D.OnBuildingClickListener() {
      @Override
      public void onBuildingClick(String buildingId, String name, MFLocationCoordinate location) {
        WritableMap event = new WritableNativeMap();
        WritableMap locationMap = new WritableNativeMap();
        locationMap.putDouble("latitude", location.getLatitude());
        locationMap.putDouble("longitude", location.getLongitude());
        event.putMap("location", locationMap);
        event.putString("buildingId", buildingId);
        event.putString("name", name);
        event.putString("action", "building-press");
        manager.pushEvent(getContext(), view, "onBuildingPress", event);
      }
    });

    map.setOnMapModeChange(new Map4D.OnMapModeChangeListener() {
      @Override
      public void onMapModeChange(boolean is3DMode) {
        WritableMap event = new WritableNativeMap();
        event.putString("mode", is3DMode ? "3d" : "2d");
        event.putString("action", "mode-change");
        manager.pushEvent(getContext(), view, "onModeChange", event);
      }
    });

    map.setOnMapClickListener(new Map4D.OnMapClickListener() {
      @Override
      public void onMapClick(MFLocationCoordinate mfLocationCoordinate) {
        WritableMap event = new WritableNativeMap();
        WritableMap location = new WritableNativeMap();
        location.putDouble("latitude", mfLocationCoordinate.getLatitude());
        location.putDouble("longitude", mfLocationCoordinate.getLongitude());
        event.putMap("coordinate", location);
        event.putString("action", "map-press");
        manager.pushEvent(getContext(), view, "onPress", event);
      }
    });

    map.setOnCameraMoveListener(new Map4D.OnCameraMoveListener() {
      @Override
      public void onCameraMove() {
        WritableMap event = getCameraMap();
        event.putString("action", "camera-move");
        manager.pushEvent(getContext(), view, "onCameraMove", event);
      }
    });

    map.setOnCameraIdleListener(new Map4D.OnCameraIdleListener() {
      @Override
      public void onCameraIdle() {
        WritableMap event = getCameraMap();
        event.putString("action", "camera-idle");
        manager.pushEvent(getContext(), view, "onCameraIdle", event);
      }
    });

    map.setOnCameraMoveStartedListener(new Map4D.OnCameraMoveStartedListener() {
      @Override
      public void onCameraMoveStarted(int reason) {
        WritableMap event = getCameraMap();
        event.putString("action", "camera-move-started");
        event.putBoolean("gesture", reason == 1);
        manager.pushEvent(getContext(), view, "onCameraMoveStart", event);
      }
    });

    map.setOnMapModeHandler(new Map4D.OnMapModeHandler() {
      @Override
      public boolean shouldChangeMapMode() {
        WritableMap event = getCameraMap();
        event.putString("action", "camera-move-started");
        manager.pushEvent(getContext(), view, "onShouldChangeMapMode", event);
        return false;
      }
    });

    map.setOnMyLocationButtonClickListener(new Map4D.OnMyLocationButtonClickListener() {
      @Override
      public boolean onMyLocationButtonClick() {
        manager.pushEvent(getContext(), view, "onMyLocationButtonPress", new WritableNativeMap());
        return false;
      }
    });
  }

  private WritableMap getCircleEventData(MFCircle circle) {
    WritableMap event = new WritableNativeMap();
    WritableMap location = new WritableNativeMap();
    location.putDouble("latitude", circle.getCenter().getLatitude());
    location.putDouble("longitude", circle.getCenter().getLongitude());
    event.putMap("coordinate", location);
    Object userData = circle.getUserData();      
    if (userData != null) {
      String userDataByString = "";
      userDataByString = userData.toString();
      int begin = userDataByString.indexOf(":") + 2;
      int end = userDataByString.length() - 2;
      userDataByString = userDataByString.substring(begin, end);
      event.putString("userData", userDataByString);
    }
    return event;
  }

  private WritableMap getPOIEventData(MFPOI poi) {
    WritableMap event = new WritableNativeMap();
    WritableMap location = new WritableNativeMap();
    location.putDouble("latitude", poi.getPosition().getLatitude());
    location.putDouble("longitude", poi.getPosition().getLongitude());
    event.putDouble("poiId", poi.getId());
    event.putString("title", poi.getTitle());
    event.putMap("coordinate", location);
    return event;
  }


  private WritableMap getMarkerEventData(MFMarker marker) {
    WritableMap event = new WritableNativeMap();
    WritableMap location = new WritableNativeMap();
    location.putDouble("latitude", marker.getPosition().getLatitude());
    location.putDouble("longitude", marker.getPosition().getLongitude());
    event.putMap("coordinate", location);
    Object userData = marker.getUserData();

    if (userData != null) {
      String userDataByString = "";
      userDataByString = userData.toString();
      int begin = userDataByString.indexOf(":") + 2;
      int end = userDataByString.length() - 2;
      userDataByString = userDataByString.substring(begin, end);
      event.putString("userData", userDataByString);
    }
    return event;
  }

  private WritableMap getPolylineEventData(MFPolyline polyline) {
    WritableMap event = new WritableNativeMap();
    WritableMap location = new WritableNativeMap();
    MFLocationCoordinate coordinate = polyline.getPoints().get(0);
    location.putDouble("latitude", coordinate.getLatitude());
    location.putDouble("longitude", coordinate.getLongitude());
    event.putMap("coordinate", location);
    Object userData = polyline.getUserData();
    
    if (userData != null) {
      String userDataByString = "";
      userDataByString = userData.toString();
      int begin = userDataByString.indexOf(":") + 2;
      int end = userDataByString.length() - 2;
      userDataByString = userDataByString.substring(begin, end);
      event.putString("userData", userDataByString);
    }      
    return event;
  }

  private WritableMap getPolygonEventData(MFPolygon polygon) {
    WritableMap event = new WritableNativeMap();
    WritableMap location = new WritableNativeMap();
    MFLocationCoordinate coordinate = polygon.getPoints().get(0);
    location.putDouble("latitude", coordinate.getLatitude());
    location.putDouble("longitude", coordinate.getLongitude());
    event.putMap("coordinate", location);
    Object userData = polygon.getUserData();
    
    if (userData != null) {
      String userDataByString = "";
      userDataByString = userData.toString();
      int begin = userDataByString.indexOf(":") + 2;
      int end = userDataByString.length() - 2;
      userDataByString = userDataByString.substring(begin, end);
      event.putString("userData", userDataByString);
    }      
    return event;
  }

  private WritableMap getCameraMap() {
    WritableMap event = new WritableNativeMap();
    MFCameraPosition pos = map.getCameraPosition();
    event.putDouble("zoom", pos.getZoom());
    event.putDouble("bearing", pos.getBearing());
    event.putDouble("tilt", pos.getTilt());
    WritableMap target = new WritableNativeMap();
    target.putDouble("latitude", pos.getTarget().getLatitude());
    target.putDouble("longitude", pos.getTarget().getLongitude());      
    event.putMap("center", target);
    return event;      
  }

  private MFCameraPosition parseCamera(ReadableMap camera) {
    MFCameraPosition.Builder builder = new MFCameraPosition.Builder(map.getCameraPosition());
    if (camera.hasKey("zoom")) {
      builder.zoom(camera.getDouble("zoom"));
    }
    if (camera.hasKey("bearing")) {
      builder.bearing(camera.getDouble("bearing"));
    }
    if (camera.hasKey("tilt")) {
      builder.tilt(camera.getDouble("tilt"));
    }
    if (camera.hasKey("center")) {
      ReadableMap center = camera.getMap("center");
      builder.target(new MFLocationCoordinate(center.getDouble("latitude"), center.getDouble("longitude")));
    }
    return builder.build();
  }

  public void moveCamera(ReadableMap camera) {
    if (map == null) return;
    MFCameraPosition cameraPosition = parseCamera(camera);
    MFCameraUpdate cameraUpdate = MFCameraUpdateFactory.newCameraPosition(cameraPosition);
    map.moveCamera(cameraUpdate);
  }

  public void animateCamera(ReadableMap camera) {
    if (map == null) return;
    MFCameraPosition cameraPosition = parseCamera(camera);
    MFCameraUpdate cameraUpdate = MFCameraUpdateFactory.newCameraPosition(cameraPosition);
    map.animateCamera(cameraUpdate);
  }

  public void enable3DMode(Boolean enable) {
    if (map == null) return;
    map.enable3DMode(enable);
  }

  public void setMapType(String mapType) {
    if (map == null) return;
    if (mapType.equals("raster")) {
      map.setMapType(MFMapType.RASTER);
    }
    else {
      map.setMapType(MFMapType.ROADMAP);
    }
  }

  public void setPOIsEnabled(Boolean enable) {
    if (map == null) return;
    map.setPOIsEnabled(enable);
  }

  public void setMyLocationEnabled(Boolean enable) {
    if (map == null) return;
    map.setMyLocationEnabled(enable);
  }

  public void setShowsMyLocationButton(boolean showMyLocationButton) {
    if (map == null) return;
    map.getUiSettings().setMyLocationButtonEnabled(showMyLocationButton);
  }

  public void setBuildingsEnabled(boolean buildingsEnable) {
    if (map == null) return;
    map.setBuildingsEnabled(buildingsEnable);
  }

  public void setTime(double time) {
    if (map == null) return;
    map.setTime(new Date((long) time));
  }

  public void fitBounds(ReadableMap boundData) {
    if (map == null) return;
    ReadableMap bounds = boundData.getMap("bounds");
    ReadableMap southWest = bounds.getMap("southWest");
    ReadableMap northEast = bounds.getMap("northEast");

    MFCoordinateBounds.Builder builder = new MFCoordinateBounds.Builder();
    double southWestLat = southWest.getDouble("latitude");
    double southWestLng = southWest.getDouble("longitude");
    builder.include(new MFLocationCoordinate(southWestLat, southWestLng));

    double northEastLat = northEast.getDouble("latitude");
    double northEastLng = northEast.getDouble("longitude");
    builder.include(new MFLocationCoordinate(northEastLat, northEastLng));

    int paddingDefault = 10;
    int paddingLeft = paddingDefault;
    int paddingRight = paddingDefault;
    int paddingTop = paddingDefault;
    int paddingBottom = paddingDefault;
    if (boundData.hasKey("padding")) {
      ReadableMap padding = boundData.getMap("padding");
      if (padding.hasKey("left")) {
        paddingLeft = padding.getInt("left");
      }
      if (padding.hasKey("right")) {
        paddingRight = padding.getInt("right");
      }
      if (padding.hasKey("top")) {
        paddingTop = padding.getInt("top");
      }
      if (padding.hasKey("bottom")) {
        paddingBottom = padding.getInt("bottom");
      }
    }
    MFCameraPosition cameraPosition = map.getCameraPositionForBounds(
      builder.build(), paddingLeft, paddingTop, paddingRight, paddingBottom);
    map.moveCamera(MFCameraUpdateFactory.newCameraPosition(cameraPosition));
  }

  public void addFeature(View child, int index) {
    if (child instanceof RMFMarker) {
      RMFMarker annotation = (RMFMarker) child;
      annotation.addToMap(map);
      features.add(index, annotation);

      // Remove from a view group if already present, prevent "specified child
      // already had a parent" error.
      ViewGroup annotationParent = (ViewGroup)annotation.getParent();
      if (annotationParent != null) {
        annotationParent.removeView(annotation);
      }

      // Add to the parent group
      attacherGroup.addView(annotation);

      MFMarker marker = (MFMarker) annotation.getFeature();
      markerMap.put(marker, annotation);
    } else if (child instanceof RMFCircle) {
      RMFCircle annotation = (RMFCircle) child;
      annotation.addToMap(map);
      features.add(index, annotation);

      // Remove from a view group if already present, prevent "specified child
      // already had a parent" error.
      ViewGroup annotationParent = (ViewGroup)annotation.getParent();
      if (annotationParent != null) {
        annotationParent.removeView(annotation);
      }

      MFCircle circle = (MFCircle) annotation.getFeature();
      circleMap.put(circle, annotation);
    } else if (child instanceof RMFPolyline) {
      RMFPolyline annotation = (RMFPolyline) child;
      annotation.addToMap(map);
      features.add(index, annotation);

      // Remove from a view group if already present, prevent "specified child
      // already had a parent" error.
      ViewGroup annotationParent = (ViewGroup)annotation.getParent();
      if (annotationParent != null) {
        annotationParent.removeView(annotation);
      }

      MFPolyline polyline = (MFPolyline) annotation.getFeature();
      polylineMap.put(polyline, annotation);
    } else if (child instanceof RMFPolygon) {
      RMFPolygon annotation = (RMFPolygon) child;
      annotation.addToMap(map);
      features.add(index, annotation);

      // Remove from a view group if already present, prevent "specified child
      // already had a parent" error.
      ViewGroup annotationParent = (ViewGroup)annotation.getParent();
      if (annotationParent != null) {
        annotationParent.removeView(annotation);
      }

      MFPolygon polygon = (MFPolygon) annotation.getFeature();
      polygonMap.put(polygon, annotation);
    } else if (child instanceof RMFPOI) {
      RMFPOI annotation = (RMFPOI) child;
      annotation.addToMap(map);
      features.add(index, annotation);

      // Remove from a view group if already present, prevent "specified child
      // already had a parent" error.
      ViewGroup annotationParent = (ViewGroup) annotation.getParent();
      if (annotationParent != null) {
        annotationParent.removeView(annotation);
      }

      MFPOI poi = (MFPOI) annotation.getFeature();
      poiMap.put(poi.getId(), annotation);
    }
    else if (child instanceof ViewGroup) {
      ViewGroup children = (ViewGroup) child;
      for (int i = 0; i < children.getChildCount(); i++) {
        addFeature(children.getChildAt(i), index);
      }
    } else {
      addView(child, index);
    }
  }

  public int getFeatureCount() {
    return features.size();
  }
  
  public View getFeatureAt(int index) {
    return features.get(index);
  }
  
  public void removeFeatureAt(int index) {
    RMFFeature feature = features.remove(index);
    if (feature instanceof RMFMarker) {
        markerMap.remove(feature.getFeature());
    } else if (feature instanceof RMFCircle) {
      circleMap.remove(feature.getFeature());
    }
    else if (feature instanceof RMFPolyline) {
      polylineMap.remove(feature.getFeature());
    }
    else if (feature instanceof RMFPolygon) {
      polygonMap.remove(feature.getFeature());
    }
    else if (feature instanceof RMFPOI) {
      MFPOI poi = (MFPOI) feature.getFeature();
      poiMap.remove(poi.getId());
    }
    feature.removeFromMap(map);
  }
}