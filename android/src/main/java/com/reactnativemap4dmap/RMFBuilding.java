package com.reactnativemap4dmap;

import android.content.Context;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.List;

import vn.map4d.map.annotations.MFBuilding;
import vn.map4d.map.annotations.MFBuildingOptions;
import vn.map4d.map.core.Map4D;
import vn.map4d.types.MFLocationCoordinate;

public class RMFBuilding extends RMFFeature {

  private MFBuilding building;

  private String name;

  private MFLocationCoordinate coordinate;

  private String model;

  private String texture;

  private double scale;

  private double bearing;

  private float elevation;

  private boolean selected;

  private boolean visible;

  private boolean touchable;

  private String userData;

  public RMFBuilding(Context context) {
    super(context);
    name = "";
    model = "";
    texture = "";
    coordinate = new MFLocationCoordinate(0, 0);
    scale = 1.0;
    bearing = 0.0;
    elevation = 0.f;
    selected = false;
    visible = true;
    touchable = true;
    userData = null;
  }

  public void setName(String name) {
    this.name = name;
    if (building != null) {
      building.setName(this.name);
    }
  }

  public void setCoordinate(ReadableMap data) {
    this.coordinate = new MFLocationCoordinate(data.getDouble("latitude"), data.getDouble("longitude"));
    if (building != null) {
      building.setLocation(this.coordinate);
    }
  }

  public void setModelUrl(String url) {
    this.model = url;
    if (building != null) {
      building.setModel(this.model);
    }
  }

  public void setTextureUrl(String url) {
    this.texture = url;
    if (building != null) {
      building.setTexture(this.texture);
    }
  }

  public void setScale(double scale) {
    this.scale = scale;
    if (building != null) {
      building.setScale(this.scale);
    }
  }

  public void setBearing(double bearing) {
    this.bearing = bearing;
    if (building != null) {
      building.setBearing(this.bearing);
    }
  }

  public void setElevation(float elevation) {
    this.elevation = elevation;
    if (building != null) {
      building.setElevation(this.elevation);
    }
  }

  public void setSelected(boolean selected) {
    this.selected = selected;
    if (building != null) {
      building.setSelected(this.selected);
    }
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
    if (building != null) {
      building.setVisible(this.visible);
    }
  }

  public void setTouchable(boolean touchable) {
    this.touchable = touchable;
    if (building != null) {
      building.setTouchable(this.touchable);
    }
  }

  public void setUserData(ReadableMap userData) {
    this.userData = userData.toString();
    if (building != null) {
      building.setUserData(this.userData);
    }
  }

  @Override
  public void addToMap(Map4D map) {
    this.building = map.addBuilding(getOptions());
  }

  @Override
  public void removeFromMap(Map4D map) {
    if (building == null) {
      return;
    }
    building.remove();
    building = null;
  }

  @Override
  public Object getFeature() {
    return building;
  }

  public MFBuildingOptions getOptions() {
    MFBuildingOptions options = new MFBuildingOptions();
    options.name(name);
    options.location(coordinate);
    options.model(model);
    options.texture(texture);
    options.scale(scale);
    options.bearing(bearing);
    options.elevation(elevation);
    options.visible(visible);
    options.touchable(touchable);
    options.userData(userData);
    return options;
  }
}
