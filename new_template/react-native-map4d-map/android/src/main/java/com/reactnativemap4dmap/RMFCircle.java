package com.reactnativemap4dmap;

import android.content.Context;

import androidx.annotation.ColorInt;

import com.facebook.react.bridge.ReadableMap;

import vn.map4d.map.core.*;
import vn.map4d.map.annotations.*;

import vn.map4d.types.MFLocationCoordinate;

public class RMFCircle extends RMFFeature {
    private MFCircle circle;
    private MFLocationCoordinate position;
    private Double radius;
    private @ColorInt int fillColor;
    private @ColorInt int strokeColor;
    private double strokeWidth;
    private double zIndex;
    private Boolean visible = true;

    public RMFCircle(Context context) {        
        super(context);        
    } 

    public void setCenter(ReadableMap data) {
        this.position = new MFLocationCoordinate(data.getDouble("latitude"), data.getDouble("longitude"));
        if (circle != null) {
          circle.setCenter(this.position);
        }
    }

    public void setRadius(double data) {      
      radius = data;
      if (circle != null) {
          circle.setRadius(radius);
      }
  }

  public void setZIndex(double data) {      
    zIndex = data;
    if (circle != null) {
        circle.setZIndex((float)zIndex);
    }
}

public void setVisible(Boolean data) {
  visible = data;
  if (circle != null) {
    circle.setVisible(data);
  }
}
  
  public void setStrokeColor(@ColorInt int strokeColor) {    
    this.strokeColor = strokeColor;
    if (circle != null) {
        circle.setStrokeColor(this.strokeColor);
    }
  };

  public void setFillColor(@ColorInt int fillColor) {
    this.fillColor = fillColor;
    if (circle != null) {
        circle.setFillColor(this.fillColor);
    }
  };

  public void setStrokeWidth(double width) {
    this.strokeWidth = width;
    if (circle != null) {
      circle.setStrokeWidth((float)this.strokeWidth);
    }
  }

    public void addToMap(Map4D map) {
      this.circle = map.addCircle(getOptions());  
    }

   public void removeFromMap(Map4D map) {
    if (circle == null) {
      return;
    }
    circle.remove();
    circle = null;
    //updateTracksViewChanges();
   }

   public MFCircleOptions getOptions() {
    MFCircleOptions options = new MFCircleOptions()
    .center(this.position)
    .radius(radius)
    .fillColor(fillColor)
    .strokeColor(strokeColor)
    .strokeWidth((float)strokeWidth)
    .zIndex((float)zIndex)
    .visible(visible);
    return options;
  }
   public Object getFeature() {
       return circle;
   }
}