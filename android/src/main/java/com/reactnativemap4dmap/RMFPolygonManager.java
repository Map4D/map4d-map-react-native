package com.reactnativemap4dmap;

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.annotations.*;
import com.facebook.react.common.MapBuilder;

import androidx.annotation.Nullable;
import androidx.annotation.ColorInt;

import java.util.Map;
import java.util.HashMap;

public class RMFPolygonManager extends ViewGroupManager<RMFPolygon> {
  private final DisplayMetrics metrics;

  private static final int k_setStrokeWidth = 1;
  private static final int k_setStrokeColor = k_setStrokeWidth + 1;
  private static final int k_setFillColor = k_setStrokeColor + 1;
  private static final int k_setVisible = k_setFillColor + 1;
  private static final int k_setTouchable = k_setVisible + 1;
  private static final int k_setZIndex = k_setTouchable + 1;
  private static final int k_setUserData = k_setZIndex + 1;

  public RMFPolygonManager(final ReactApplicationContext reactContext) {
    super();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      metrics = new DisplayMetrics();
      ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay()
          .getRealMetrics(metrics);
    } else {
      metrics = reactContext.getResources().getDisplayMetrics();
    }
  }

  @Override
  public String getName() {
    return "RMFPolygon";
  }

  @Override
  protected RMFPolygon createViewInstance(final ThemedReactContext reactContext) {
    return new RMFPolygon(reactContext);
  }

  @Override
  public void receiveCommand(final RMFPolygon view, final int commandId, @Nullable final ReadableArray args) {
    ReadableMap data;
    switch (commandId) {
      case k_setStrokeWidth:
        final float width = (float) args.getDouble(0) * metrics.density;
        view.setStrokeWidth(width);
        break;
      case k_setStrokeColor:
        view.setStrokeColor(args.getInt(0));
        break;
      case k_setFillColor:
        view.setFillColor(args.getInt(0));
        break;
      case k_setVisible:
        view.setVisible(args.getBoolean(0));
        break;
      case k_setTouchable:
        view.setTouchable(args.getBoolean(0));
        break;
      case k_setZIndex:
        view.setZIndex((float) args.getDouble(0));
        break;
      case k_setUserData:
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

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    final HashMap<String, Integer> map = new HashMap();
    map.put("setStrokeWidth", k_setStrokeWidth);
    map.put("setStrokeColor", k_setStrokeColor);
    map.put("setFillColor", k_setFillColor);
    map.put("setVisible", k_setVisible);
    map.put("setTouchable", k_setTouchable);
    map.put("setZIndex", k_setZIndex);
    map.put("setUserData", k_setUserData);
    return map;
  }

  @ReactProp(name = "coordinates")
  public void setCoordinates(final RMFPolygon view, final ReadableArray coordinates) {
    view.setCoordinates(coordinates);
  }

  @ReactProp(name = "holes")
  public void setHoles(final RMFPolygon view, final ReadableArray holes) {
    view.setHoles(holes);
  }

  @ReactProp(name = "strokeWidth")
  public void setStrokeWidth(final RMFPolygon view, final float widthInPoints) {
    final float widthInScreenPx = metrics.density * widthInPoints;
    view.setStrokeWidth(widthInScreenPx);
  }

  @ReactProp(name = "strokeColor", customType = "Color")
  public void setStrokeColor(final RMFPolygon view, @ColorInt final int color) {
    view.setStrokeColor(color);
  }

  @ReactProp(name = "fillColor", customType = "Color")
  public void setFillColor(final RMFPolygon view, @ColorInt final int color) {
    view.setFillColor(color);
  }

  @ReactProp(name = "visible")
  public void setVisible(final RMFPolygon view, final boolean visible) {
    view.setVisible(visible);
  }

  @ReactProp(name = "touchable")
  public void setTouchable(final RMFPolygon view, final boolean touchable) {
    view.setTouchable(touchable);
  }

  @ReactProp(name = "zIndex")
  public void setZIndex(final RMFPolygon view, final float zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "userData")
  public void setUserData(final RMFPolygon view, final ReadableMap userData) {
    view.setUserData(userData);
  }

}