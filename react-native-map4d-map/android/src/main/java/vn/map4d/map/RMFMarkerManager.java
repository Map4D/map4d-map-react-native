package vn.map4d.map;

import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.annotations.*;
import com.facebook.react.common.MapBuilder;

import androidx.annotation.Nullable;

import java.util.Map;
import java.util.HashMap;

import vn.map4d.types.MFLocationCoordinate;
import vn.map4d.map.annotations.*;


public class RMFMarkerManager extends ViewGroupManager<RMFMarker> {
    private static final int SET_LOCATION = 1;

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
        case SET_LOCATION:
        data = args.getMap(0);
          view.setPosition(data);
          break;
      }
    }


    @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    HashMap<String, Integer> map = new HashMap();    
    map.put("setLocation", SET_LOCATION);
    return map;
  }


   @ReactProp(name = "coordinate")
   public void setPosition(RMFMarker view, ReadableMap map) {
        view.setPosition(map);
   }

}