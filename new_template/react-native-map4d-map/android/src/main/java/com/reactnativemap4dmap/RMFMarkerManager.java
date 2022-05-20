package com.reactnativemap4dmap;

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;
import android.view.View;

import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.annotations.*;
import com.facebook.react.common.MapBuilder;

import androidx.annotation.Nullable;

import java.util.Map;
import java.util.HashMap;

public class RMFMarkerManager extends ViewGroupManager<RMFMarker> {
  private final DisplayMetrics metrics;

  private static final int k_setCoordinate = 1;
  private static final int k_setRotation = k_setCoordinate + 1;
  private static final int k_setTitle = k_setRotation + 1;
  private static final int k_setSnippet = k_setTitle + 1;
  private static final int k_setDraggable = k_setSnippet + 1;
  private static final int k_setZIndex = k_setDraggable + 1;
  private static final int k_setVisible = k_setZIndex + 1;
  private static final int k_setInfoWindowAnchor = k_setVisible + 1;
  private static final int k_setElevation = k_setInfoWindowAnchor + 1;
  private static final int k_setUserData = k_setElevation + 1;

  public RMFMarkerManager(ReactApplicationContext reactContext) {
    super();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      metrics = new DisplayMetrics();
      ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
          .getDefaultDisplay()
          .getRealMetrics(metrics);
    } else {
      metrics = reactContext.getResources().getDisplayMetrics();
    }
  }

  @Override
  public String getName() {
    return "RMFMarker";
  }

  @Override
  protected RMFMarker createViewInstance(ThemedReactContext reactContext) {
    return new RMFMarker(reactContext);
  }

  @Override
  public void receiveCommand(RMFMarker view, int commandId, @Nullable ReadableArray args) {
    ReadableMap data;
    switch (commandId) {
      case k_setCoordinate:
        data = args.getMap(0);
        view.setPosition(data);
        break;
      case k_setRotation:
        view.setRotation(args.getDouble(0));
        break;
      case k_setTitle:
        view.setTitle(args.getString(0));
        break;
      case k_setSnippet:
        view.setSnippet(args.getString(0));
        break;
      case k_setDraggable:
        view.setDraggable(args.getBoolean(0));
        break;
      case k_setZIndex:
        view.setZIndex(args.getDouble(0));
        break;
      case k_setVisible:
        view.setVisible(args.getBoolean(0));
        break;
      case k_setInfoWindowAnchor:
        data = args.getMap(0);
        view.setInfoWindowAnchor(data);
        break;
      case k_setElevation:
        view.setElevation(args.getDouble(0));
        break;
      case k_setUserData:
        data = args.getMap(0);
        view.setUserData(data);
        break;
    }
  }

  @Override
  public Map getExportedCustomDirectEventTypeConstants() {
    Map<String, Map<String, String>> map = MapBuilder.of(
      "onDrag", MapBuilder.of("registrationName", "onDrag"),
      "onDragStart", MapBuilder.of("registrationName", "onDragStart"),
      "onDragEnd", MapBuilder.of("registrationName", "onDragEnd"),
      "onPress", MapBuilder.of("registrationName", "onPress"),
      "onPressInfoWindow", MapBuilder.of("registrationName", "onPressInfoWindow")
    );
    return map;
  }

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    HashMap<String, Integer> map = new HashMap();
    map.put("setCoordinate", k_setCoordinate);
    map.put("setRotation", k_setRotation);
    map.put("setTitle", k_setTitle);
    map.put("setSnippet", k_setSnippet);
    map.put("setDraggable", k_setDraggable);
    map.put("setZIndex", k_setZIndex);
    map.put("setVisible", k_setVisible);
    map.put("setInfoWindowAnchor", k_setInfoWindowAnchor);
    map.put("setElevation", k_setElevation);
    map.put("setUserData", k_setUserData);
    return map;
  }

  @Override
  public void addView(RMFMarker parent, View child, int index) {
    super.addView(parent, child, index);
  }

  @Override
  public LayoutShadowNode createShadowNodeInstance() {
    // we use a custom shadow node that emits the width/height of the view
    // after layout with the updateExtraData method. Without this, we can't generate
    // a bitmap of the appropriate width/height of the rendered view.
    return new SizeReportingShadowNode();
  }

  @Override
  public void updateExtraData(RMFMarker view, Object extraData) {
    // This method is called from the shadow node with the width/height of the rendered
    // marker view.
    HashMap<String, Float> data = (HashMap<String, Float>) extraData;
    float width = data.get("width");
    float height = data.get("height");
    view.update((int) width, (int) height);
  }

  @ReactProp(name = "coordinate")
  public void setCoordinate(RMFMarker view, ReadableMap map) {
    view.setPosition(map);
  }

  @ReactProp(name = "anchor")
  public void setAnchor(RMFMarker view, ReadableMap map) {
    view.setAnchor(map);
  }

  @ReactProp(name = "infoWindowAnchor")
  public void setInfoWindowAnchor(RMFMarker view, ReadableMap map) {
    view.setInfoWindowAnchor(map);
  }

  @ReactProp(name = "draggable")
  public void setDraggable(RMFMarker view, boolean draggable) {
    view.setDraggable(draggable);
  }

  @ReactProp(name = "visible")
  public void setVisible(RMFMarker view, boolean visible) {
    view.setVisible(visible);
  }

  @ReactProp(name = "title")
  public void setTitle(RMFMarker view, String title) {
    view.setTitle(title);
  }

  @ReactProp(name = "snippet")
  public void setSnippet(RMFMarker view, String snippet) {
    view.setSnippet(snippet);
  }

  @ReactProp(name = "zIndex")
  public void setZIndex(RMFMarker view, double zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "rotation")
  public void setRotation(RMFMarker view, double rotation) {
    view.setRotation(rotation);
  }

  @ReactProp(name = "icon")
  public void setIcon(RMFMarker view, ReadableMap data) {
    String uri = data != null && data.hasKey("uri") ? data.getString("uri") : null;
    int width = data != null && data.hasKey("width") ? (int) (data.getInt("width") * metrics.density) : 0;
    int height = data != null && data.hasKey("height") ? (int) (data.getInt("height") * metrics.density) : 0;
    view.setIcon(uri, width, height);
  }

  @ReactProp(name = "elevation")
  public void setElevation(RMFMarker view, double elevation) {
    view.setElevation(elevation);
  }

  @ReactProp(name = "userData")
  public void setUserData(RMFMarker view, ReadableMap userData) {
    view.setUserData(userData);
  }

}