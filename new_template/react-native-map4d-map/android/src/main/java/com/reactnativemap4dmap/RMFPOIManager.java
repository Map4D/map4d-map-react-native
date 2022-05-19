package com.reactnativemap4dmap;

import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.annotations.*;
import com.facebook.react.common.MapBuilder;

import androidx.annotation.Nullable;
import androidx.annotation.ColorInt;

import java.util.Map;
import java.util.HashMap;

public class RMFPOIManager extends ViewGroupManager<RMFPOI> {
  private static final int k_setCoordinate = 1;
  private static final int k_setTitle = k_setCoordinate + 1;
  private static final int k_setTitleColor = k_setTitle + 1;
  private static final int k_setSubTitle = k_setTitleColor + 1;
  private static final int k_setType = k_setSubTitle + 1;
  private static final int k_setIcon = k_setType + 1;
  private static final int k_setZIndex = k_setIcon + 1;

    @Override
    public String getName() {
        return "RMFPOI";
    }

    @Override
    protected RMFPOI createViewInstance(ThemedReactContext reactContext) {
      return new RMFPOI(reactContext);
    }

    @Override
    public void receiveCommand(RMFPOI view, int commandId, @Nullable ReadableArray args) {
      ReadableMap data;
      switch (commandId) {
        case k_setCoordinate:
          data = args.getMap(0);
          view.setCoordinate(data);
          break;
        case k_setTitle:
          view.setTitle(args.getString(0));
          break;
        case k_setTitleColor:
          view.setTitleColor(args.getInt(0));
          break;
        case k_setSubTitle:
          view.setSubTitle(args.getString(0));
          break;
        case k_setType:
          view.setType(args.getString(0));
          break;
        case k_setIcon:
          view.setIcon(args.getMap(0));
          break;
        case k_setZIndex:
          view.setZIndex(args.getDouble(0));
          break;
      }
    }

  @Override
  public Map getExportedCustomDirectEventTypeConstants() {
    Map<String, Map<String, String>> map = MapBuilder.of(
      "onPress", MapBuilder.of("registrationName", "onPress")
    );
    return map;
  }

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    HashMap<String, Integer> map = new HashMap();
    map.put("setCoordinate", k_setCoordinate);
    map.put("setTitle", k_setTitle);
    map.put("setTitleColor", k_setTitleColor);
    map.put("setSubTitle", k_setSubTitle);
    map.put("setPoiType", k_setType);
    map.put("setZIndex", k_setZIndex);
    return map;
  }

  @ReactProp(name = "coordinate")
  public void setCoordinate(RMFPOI view, ReadableMap map) {
      view.setCoordinate(map);
  }

  @ReactProp(name = "title")
  public void setTitle(RMFPOI view, String title) {
    view.setTitle(title);
  }

  @ReactProp(name = "titleColor", customType = "Color")
  public void setTitleColor(RMFPOI view, @ColorInt int titleColor) {
    view.setTitleColor(titleColor);
  }

  @ReactProp(name = "subtitle")
  public void setSubTitle(RMFPOI view, String subTitle) {
    view.setSubTitle(subTitle);
  }

  @ReactProp(name = "icon")
  public void setIcon(RMFPOI view, ReadableMap icon) {
    view.setIcon(icon);
  }

  @ReactProp(name = "poiType")
  public void setType(RMFPOI view, String poiType) {
    view.setType(poiType);
  }

  @ReactProp(name = "zIndex")
  public void setZIndex(RMFPOI view, double zIndex) {
    view.setZIndex(zIndex);
  }

}