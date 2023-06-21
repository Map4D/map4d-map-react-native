package com.reactnativemap4dmap;

import android.content.Context;
import android.graphics.Color;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;

import vn.map4d.map.core.*;
import vn.map4d.map.annotations.*;

import androidx.annotation.ColorInt;

import vn.map4d.types.MFLocationCoordinate;

import java.util.ArrayList;
import java.util.List;

public class RMFPolygon extends RMFFeature {
  private MFPolygonOptions options;
  private MFPolygon polygon;

  private List<MFLocationCoordinate> points;
  private List<List<MFLocationCoordinate>> holes;
  private @ColorInt int fillColor;
  private @ColorInt int strokeColor;
  private float strokeWidth;
  private boolean visible;
  private boolean touchable;
  private float zIndex;
  private String userData;

  public RMFPolygon(Context context) {
      super(context);
      points = new ArrayList<>();
      holes = new ArrayList<>();
      fillColor = Color.RED;
      strokeColor = Color.BLUE;
      strokeWidth = 1.f;
      visible = true;
      touchable = true;
      zIndex = 0.0f;
      userData = null;
  } 

  public void addToMap(Map4D map) {
    this.polygon = map.addPolygon(getOptions());
  }

  public void removeFromMap(Map4D map) {
    if (polygon == null) {
      return;
    }
    polygon.remove();
    polygon = null;
  }

  public void setCoordinates(ReadableArray coordinates) {
    this.points = new ArrayList<>(coordinates.size());
    for (int i = 0; i < coordinates.size(); i++) {
      ReadableMap coordinate = coordinates.getMap(i);
      this.points.add(i,
        new MFLocationCoordinate(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }
  }

  public void setHoles(ReadableArray holes) {
    if (holes == null) {
      return;
    }

    this.holes = new ArrayList<>(holes.size());
    for (int i = 0; i < holes.size(); i++) {
      ReadableArray hole = holes.getArray(i);
      if (hole.size() < 3) {
        continue;
      }
      List<MFLocationCoordinate> coordinates = new ArrayList<>();
      for (int j = 0; j < hole.size(); j++) {
        ReadableMap coordinate = hole.getMap(j);
        coordinates.add(new MFLocationCoordinate(
            coordinate.getDouble("latitude"),
            coordinate.getDouble("longitude")));
      }
      // If hole is triangle
      if (coordinates.size() == 3) {
        coordinates.add(coordinates.get(0));
      }
      this.holes.add(coordinates);
    }
  }

  public void setStrokeWidth(float strokeWidth) {
    this.strokeWidth = strokeWidth;
    if (polygon != null) {
      polygon.setStrokeWidth(strokeWidth);
    }
  }

  public void setStrokeColor(@ColorInt int color) {
    this.strokeColor = color;
    if (polygon != null) {
      polygon.setStrokeColor(color);
    }
  }

  public void setFillColor(@ColorInt int color) {
    this.fillColor = color;
    if (polygon != null) {
      polygon.setFillColor(color);
    }
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
    if (polygon != null) {
      polygon.setVisible(this.visible);
    }
  }

  public void setTouchable(boolean touchable) {
    this.touchable = touchable;
    if (polygon != null) {
      polygon.setTouchable(this.touchable);
    }
  }

  public void setZIndex(float zIndex) {
    this.zIndex = zIndex;
    if (polygon != null) {
      polygon.setZIndex(this.zIndex);
    }
  }

  public void setUserData(ReadableMap userData) {
    this.userData = userData.toString();
    if (polygon != null) {
      polygon.setUserData(this.userData);
    }
  }

   public MFPolygonOptions getOptions() {
    if (options == null) {
      options = new MFPolygonOptions();
    }
    fillOptions(options);
    return options;
  }

  private MFPolygonOptions fillOptions(MFPolygonOptions options) {
    for (MFLocationCoordinate point : points) {
      options.add(point);
    }
    for (int i = 0; i < holes.size(); ++i) {
      List<MFLocationCoordinate> hole = holes.get(i);
      MFLocationCoordinate[] holeArray = new MFLocationCoordinate[hole.size()];
      hole.toArray(holeArray);
      options.addHole(holeArray);
    }
    options.zIndex(zIndex);
    options.fillColor(fillColor);
    options.strokeColor(strokeColor);
    options.strokeWidth(strokeWidth);
    options.visible(visible);
    options.touchable(touchable);
    options.userData(userData);
    return options;
  }

   public Object getFeature() {
      return polygon;
   }
}