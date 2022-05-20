package com.reactnativemap4dmap;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashMap;
import java.util.Map;

import vn.map4d.map.core.MFCoordinateBounds;
import vn.map4d.types.MFLocationCoordinate;

public class RMFGroundOverlayManager extends ViewGroupManager<RMFGroundOverlay> {
  private static final int k_setVisible = 1;
  private static final int k_setZIndex = k_setVisible + 1;
  private static final int k_setOverride = k_setZIndex + 1;

  @Override
  public String getName() {
    return "RMFGroundOverlay";
  }

  @Override
  protected RMFGroundOverlay createViewInstance(final ThemedReactContext reactContext) {
    return new RMFGroundOverlay(reactContext);
  }

  @Override
  public void receiveCommand(final RMFGroundOverlay view, final int commandId, @Nullable final ReadableArray args) {
    ReadableMap data;
    switch (commandId) {
      case k_setVisible:
        view.setVisible(args.getBoolean(0));
        break;
      case k_setZIndex:
        view.setZIndex(args.getDouble(0));
        break;
      case k_setOverride:
        view.setOverride(args.getBoolean(0));
        break;
    }
  }

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    final HashMap<String, Integer> map = new HashMap();
    map.put("setVisible", k_setVisible);
    map.put("setZIndex", k_setZIndex);
    map.put("setOverride", k_setOverride);
    return map;
  }

  @ReactProp(name = "urlTemplate")
  public void setTemplateUrl(final RMFGroundOverlay view, final String url) {
    view.setTemplateUrl(url);
  }

  @ReactProp(name = "visible")
  public void setVisible(final RMFGroundOverlay view, final boolean visible) {
    view.setVisible(visible);
  }

  @ReactProp(name = "zIndex")
  public void setZIndex(final RMFGroundOverlay view, final double zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "override")
  public void setOverride(final RMFGroundOverlay view, final boolean override) {
    view.setOverride(override);
  }

  @ReactProp(name = "bounds")
  public void setBounds(final RMFGroundOverlay view, final ReadableMap boundData) {
    ReadableMap southWest = boundData.getMap("southWest");
    ReadableMap northEast = boundData.getMap("northEast");

    MFCoordinateBounds.Builder builder = new MFCoordinateBounds.Builder();
    double southWestLat = southWest.getDouble("latitude");
    double southWestLng = southWest.getDouble("longitude");
    builder.include(new MFLocationCoordinate(southWestLat, southWestLng));

    double northEastLat = northEast.getDouble("latitude");
    double northEastLng = northEast.getDouble("longitude");
    builder.include(new MFLocationCoordinate(northEastLat, northEastLng));
    view.setBounds(builder.build());
  }

}