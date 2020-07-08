package vn.map4d.map;

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

import vn.map4d.types.MFLocationCoordinate;
import vn.map4d.map.annotations.*;


public class RMFPolylineManager extends ViewGroupManager<RMFPolyline> {
  private final DisplayMetrics metrics;

  private static final int k_setWidth = 1;
  private static final int k_setColor = k_setWidth + 1;
  private static final int k_setVisible = k_setColor + 1;
  private static final int k_setTouchable = k_setVisible + 1;
  private static final int k_setZIndex = k_setTouchable + 1;
  private static final int k_setUserData = k_setZIndex + 1;

  public RMFPolylineManager(ReactApplicationContext reactContext) {
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
        return "RMFPolyline";
    }

    @Override
    protected RMFPolyline createViewInstance(ThemedReactContext reactContext) {        
        return new RMFPolyline(reactContext);
    }

    @Override
    public void receiveCommand(RMFPolyline view, int commandId, @Nullable ReadableArray args) {    
      ReadableMap data;
      switch (commandId) {
        case k_setWidth:
          float width = (float) args.getDouble(0) * metrics.density;
          view.setWidth(width);
          break;
        case k_setColor:
          view.setColor(args.getInt(0));
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
      Map<String, Map<String, String>> map = MapBuilder.of(
        "onPress", MapBuilder.of("registrationName", "onPress")
      );      
      return map;
    }


    @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    HashMap<String, Integer> map = new HashMap();
    map.put("setWidth", k_setWidth);
    map.put("setColor", k_setColor);
    map.put("setVisible", k_setVisible);
    map.put("setTouchable", k_setTouchable);
    map.put("setZIndex", k_setZIndex);
    map.put("setUserData", k_setUserData);
    return map;
  }


  @ReactProp(name = "coordinates")
  public void setCoordinates(RMFPolyline view, ReadableArray coordinates) {
      view.setCoordinates(coordinates);
  }

  @ReactProp(name = "width")
  public void setWidth(RMFPolyline view, float widthInPoints) {
    float widthInScreenPx = metrics.density * widthInPoints;
    view.setWidth(widthInScreenPx);
  }

  @ReactProp(name = "color", customType = "Color")
  public void setColor(RMFPolyline view, @ColorInt int color) {
    view.setColor(color);
  }

  @ReactProp(name = "lineStyle")
  public void setLineStyle(RMFPolyline view, String lineStyle) {
    view.setLineStyle(lineStyle);
  }

  @ReactProp(name = "visible")
  public void setVisible(RMFPolyline view, boolean visible) {
    view.setVisible(visible);
  }

  @ReactProp(name = "touchable")
  public void setTouchable(RMFPolyline view, boolean touchable) {
    view.setTouchable(touchable);
  }

  @ReactProp(name = "zIndex")
  public void setZIndex(RMFPolyline view, float zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "userData")
  public void setUserData(RMFPolyline view, ReadableMap userData) {
    view.setUserData(userData);
  }

}