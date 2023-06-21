package com.reactnativemap4dmap;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashMap;
import java.util.Map;

public class RMFTileOverlayManager extends ViewGroupManager<RMFTileOverlay> {
  private static final int k_setVisible = 1;
  private static final int k_setZIndex = k_setVisible + 1;

  @Override
  public String getName() {
    return "RMFTileOverlay";
  }

  @Override
  protected RMFTileOverlay createViewInstance(final ThemedReactContext reactContext) {
    return new RMFTileOverlay(reactContext);
  }

  @Override
  public void receiveCommand(final RMFTileOverlay view, final int commandId, @Nullable final ReadableArray args) {
    ReadableMap data;
    switch (commandId) {
      case k_setVisible:
        view.setVisible(args.getBoolean(0));
        break;
      case k_setZIndex:
        view.setZIndex(args.getDouble(0));
        break;
    }
  }

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    final HashMap<String, Integer> map = new HashMap();
    map.put("setVisible", k_setVisible);
    map.put("setZIndex", k_setZIndex);
    return map;
  }

  @ReactProp(name = "urlTemplate")
  public void setTemplateUrl(final RMFTileOverlay view, final String url) {
    view.setTemplateUrl(url);
  }

  @ReactProp(name = "visible")
  public void setVisible(final RMFTileOverlay view, final boolean visible) {
    view.setVisible(visible);
  }

  @ReactProp(name = "zIndex")
  public void setZIndex(final RMFTileOverlay view, final double zIndex) {
    view.setZIndex(zIndex);
  }

}