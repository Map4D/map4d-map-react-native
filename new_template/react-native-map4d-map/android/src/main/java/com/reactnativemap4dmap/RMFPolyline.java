package com.reactnativemap4dmap;

import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.view.View;
import android.widget.Button;
import android.view.ViewTreeObserver;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import vn.map4d.map.core.*;
import vn.map4d.map.annotations.*;

import android.util.Log;
import android.graphics.Color;
import androidx.annotation.ColorInt;

import vn.map4d.map.camera.*;
import vn.map4d.types.MFLocationCoordinate;
import vn.map4d.map.camera.MFCameraPosition;
import vn.map4d.map.core.MFPolylineStyle;

import java.util.ArrayList;
import java.util.List;

public class RMFPolyline extends RMFFeature {
  private MFPolylineOptions options;
  private MFPolyline polyline;

  private List<MFLocationCoordinate> coordinates;
  private float width;
  private @ColorInt int color;
  private boolean visible;
  private boolean touchable;
  private float zIndex;
  private String userData;
  private MFPolylineStyle style;

  public RMFPolyline(Context context) {
      super(context);
      this.coordinates = new ArrayList<>();
      width = 2.0f;
      color = Color.BLACK;
      visible = true;
      touchable = true;
      zIndex = 0.0f;
      userData = null;
      style = MFPolylineStyle.Solid;
  } 

  public void addToMap(Map4D map) {
    this.polyline = map.addPolyline(getOptions());
  }

  public void removeFromMap(Map4D map) {
    if (polyline == null) {
      return;
    }
    polyline.remove();
    polyline = null;
  }

  public void setCoordinates(ReadableArray coordinates) {
    this.coordinates = new ArrayList<>(coordinates.size());
    for (int i = 0; i < coordinates.size(); i++) {
      ReadableMap coordinate = coordinates.getMap(i);
      this.coordinates.add(i,
        new MFLocationCoordinate(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }
  }

  public void setWidth(float width) {
    this.width = width;
    if (polyline != null) {
      polyline.setWidth(width);
    }
  }

  public void setColor(@ColorInt int color) {
    this.color = color;
    if (polyline != null) {
      polyline.setColor(this.color);
    }
  }

  public void setLineStyle(String lineStyle) {
    if (lineStyle.equals("solid")) {
      this.style = MFPolylineStyle.Solid;
    }
    else if (lineStyle.equals("dotted")) {
      this.style = MFPolylineStyle.Dotted;
    }
    if (polyline != null) {
      polyline.setStyle(this.style);
    }
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
    if (polyline != null) {
      polyline.setVisible(this.visible);
    }
  }

  public void setTouchable(boolean touchable) {
    this.touchable = touchable;
    if (polyline != null) {
      polyline.setTouchable(this.touchable);
    }
  }

  public void setZIndex(float zIndex) {
    this.zIndex = zIndex;
    if (polyline != null) {
      polyline.setZIndex(this.zIndex);
    }
  }

  public void setUserData(ReadableMap userData) {
    this.userData = userData.toString();
    if (polyline != null) {
      polyline.setUserData(this.userData);
    }
  }

   public MFPolylineOptions getOptions() {
    if (options == null) {
      options = new MFPolylineOptions();
    }

    fillOptions(options);
    return options;
  }

  private MFPolylineOptions fillOptions(MFPolylineOptions options) {
    for (MFLocationCoordinate coord : coordinates) {
      options.add(coord);
    }
    options.zIndex(zIndex);
    options.width(width);
    options.color(color);
    options.visible(visible);
    options.touchable(touchable);
    options.style(style);
    options.userData(userData);
    return options;
  }

   public Object getFeature() {
      return polyline;
   }
}