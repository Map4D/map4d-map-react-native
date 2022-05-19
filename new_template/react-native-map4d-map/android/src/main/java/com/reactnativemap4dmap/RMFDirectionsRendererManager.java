package com.reactnativemap4dmap;

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashMap;
import java.util.Map;

public class RMFDirectionsRendererManager extends ViewGroupManager<RMFDirectionsRenderer> {

  private final DisplayMetrics metrics;

  private static final int k_setWidth = 1;
  private static final int k_setActivedIndex = k_setWidth + 1;
  private static final int k_setRoutes = k_setActivedIndex + 1;
  private static final int k_setDirections = k_setRoutes + 1;

  public RMFDirectionsRendererManager(final ReactApplicationContext reactContext) {
    super();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      metrics = new DisplayMetrics();
      ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay()
        .getRealMetrics(metrics);
    } else {
      metrics = reactContext.getResources().getDisplayMetrics();
    }
  }

  @NonNull
  @Override
  public String getName() {
    return "RMFDirectionsRenderer";
  }

  @NonNull
  @Override
  protected RMFDirectionsRenderer createViewInstance(@NonNull ThemedReactContext reactContext) {
    return new RMFDirectionsRenderer(reactContext);
  }

  @Override
  public void receiveCommand(final RMFDirectionsRenderer view, final int commandId, @Nullable final ReadableArray args) {
    ReadableArray data;
    switch (commandId) {
      case k_setWidth:
        final float width = (float) args.getDouble(0) * metrics.density;
        view.setWidth(width);
        break;
      case k_setDirections:
        view.setJsonData(args.getString(0));
        break;
      case k_setRoutes:
        data = args.getArray(0);
        view.setPaths(data);
    }
  }

  @Override
  public Map getExportedCustomDirectEventTypeConstants() {
    final Map<String, Map<String, String>> map = MapBuilder.of(
      "onPress", MapBuilder.of("registrationName", "onPress"));
    return map;
  }

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    final HashMap<String, Integer> map = new HashMap();
    map.put("setWidth", k_setWidth);
    map.put("setActivedIndex", k_setActivedIndex);
    map.put("setRoutes", k_setRoutes);
    map.put("setDirections", k_setDirections);
    return map;
  }

  @ReactProp(name = "routes")
  public void setPaths(final RMFDirectionsRenderer view, final ReadableArray routes) {
    view.setPaths(routes);
  }

  @ReactProp(name = "directions")
  public void setJsonData(final RMFDirectionsRenderer view, final String jsonData) {
    view.setJsonData(jsonData);
  }

  @ReactProp(name = "activedIndex")
  public void setActivedIndex(final RMFDirectionsRenderer view, final int activedIndex) {
    view.setActivedIndex(activedIndex);
  }

  @ReactProp(name = "activeStrokeWidth")
  public void setActiveStrokeWidth(final RMFDirectionsRenderer view, final float width) {
    view.setWidth(width);
  }

  @ReactProp(name = "activeStrokeColor", customType = "Color")
  public void setActiveStrokeColor(final RMFDirectionsRenderer view, @ColorInt final int color) {
    view.setActiveStrokeColor(color);
  }

  @ReactProp(name = "activeOutlineWidth")
  public void setActiveOutlineWidth(final RMFDirectionsRenderer view, final float width) {
  }

  @ReactProp(name = "activeOutlineColor", customType = "Color")
  public void setActiveOutlineColor(final RMFDirectionsRenderer view, @ColorInt final int color) {
    view.setActiveOutlineColor(color);
  }

  @ReactProp(name = "inactiveStrokeColor", customType = "Color")
  public void setInactiveStrokeColor(final RMFDirectionsRenderer view, @ColorInt final int color) {
    view.setInactiveStrokeColor(color);
  }

  @ReactProp(name = "inactiveOutlineColor", customType = "Color")
  public void setInactiveOutlineColor(final RMFDirectionsRenderer view, @ColorInt final int color) {
    view.setInactiveOutlineColor(color);
  }

  @ReactProp(name = "originPOIOptions")
  public void setOriginPOIOptions(RMFDirectionsRenderer view, ReadableMap map) {
    view.setOriginPOIOptions(map);
  }

  @ReactProp(name = "destinationPOIOptions")
  public void setDestinationPOIOptions(RMFDirectionsRenderer view, ReadableMap map) {
    view.setDestinationPOIOptions(map);
  }
}
