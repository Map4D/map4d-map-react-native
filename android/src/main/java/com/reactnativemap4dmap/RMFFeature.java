package com.reactnativemap4dmap;

import android.content.Context;
import com.facebook.react.views.view.ReactViewGroup;

import vn.map4d.map.core.*;

public abstract class RMFFeature extends ReactViewGroup {
  public RMFFeature(Context context) {
    super(context);
  }

   public abstract void addToMap(Map4D map);

   public abstract void removeFromMap(Map4D map);

   public abstract Object getFeature();
}