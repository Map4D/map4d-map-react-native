package com.reactnativemap4dmap;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class RMFBuildingManager extends ViewGroupManager<RMFBuilding> {

  @NonNull
  @Override
  public String getName() {
    return "RMFBuilding";
  }

  @NonNull
  @Override
  protected RMFBuilding createViewInstance(@NonNull ThemedReactContext reactContext) {
    return new RMFBuilding(reactContext);
  }

  @Override
  public void receiveCommand(@NonNull RMFBuilding view, String commandId, @Nullable ReadableArray args) {
    ReadableMap data;
    switch (commandId) {
      case "setName":
        view.setName(args.getString(0));
        break;
      case "setScale":
        view.setScale(args.getDouble(0));
        break;
      case "setBearing":
        view.setBearing(args.getDouble(0));
        break;
      case "setElevation":
        view.setElevation((float) args.getDouble(0));
        break;
      case "setSelected":
        view.setSelected(args.getBoolean(0));
        break;
      case "setVisible":
        view.setVisible(args.getBoolean(0));
        break;
      case "setTouchable":
        view.setTouchable(args.getBoolean(0));
        break;
      case "setUserData":
        data = args.getMap(0);
        view.setUserData(data);
        break;
    }
  }

  @Override
  public Map getExportedCustomDirectEventTypeConstants() {
    final Map<String, Map<String, String>> map = MapBuilder.of("onPress", MapBuilder.of("registrationName", "onPress"));
    return map;
  }

  @ReactProp(name = "name")
  public void setName(final RMFBuilding view, final String name) {
    view.setName(name);
  }

  @ReactProp(name = "coordinate")
  public void setCoordinate(final RMFBuilding view, final ReadableMap map) {
    view.setCoordinate(map);
  }

  @ReactProp(name = "modelUrl")
  public void setModelUrl(final RMFBuilding view, final String url) {
    view.setModelUrl(url);
  }

  @ReactProp(name = "textureUrl")
  public void setTextureUrl(final RMFBuilding view, final String url) {
    view.setTextureUrl(url);
  }

  @ReactProp(name = "scale")
  public void setScale(final RMFBuilding view, final double scale) {
    view.setScale(scale);
  }

  @ReactProp(name = "bearing")
  public void setBearing(final RMFBuilding view, final double bearing) {
    view.setBearing(bearing);
  }

  @ReactProp(name = "elevation")
  public void setElevation(final RMFBuilding view, final float elevation) {
    view.setElevation(elevation);
  }

  @ReactProp(name = "selected")
  public void setSelected(final RMFBuilding view, final boolean selected) {
    view.setSelected(selected);
  }

  @ReactProp(name = "visible")
  public void setVisible(final RMFBuilding view, final boolean visible) {
    view.setVisible(visible);
  }

  @ReactProp(name = "touchable")
  public void setTouchable(final RMFBuilding view, final boolean touchable) {
    view.setTouchable(touchable);
  }

  @ReactProp(name = "userData")
  public void setUserData(final RMFBuilding view, final ReadableMap userData) {
    view.setUserData(userData);
  }
}
