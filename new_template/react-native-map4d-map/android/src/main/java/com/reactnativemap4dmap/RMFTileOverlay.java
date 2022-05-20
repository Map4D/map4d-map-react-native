package com.reactnativemap4dmap;

import android.content.Context;

import vn.map4d.map.core.*;

import vn.map4d.map.overlays.MFTileOverlay;
import vn.map4d.map.overlays.MFTileOverlayOptions;
import vn.map4d.map.overlays.MFTileProvider;
import vn.map4d.map.overlays.MFUrlTileProvider;

public class RMFTileOverlay extends RMFFeature {

  private MFTileOverlayOptions options;
  private MFTileOverlay tileOverlay;

  private String templateUrl;
  private boolean visible;
  private double zIndex;

  public RMFTileOverlay(Context context) {
    super(context);
    visible = true;
    zIndex = 0.0f;
    templateUrl = null;
  } 

  public void addToMap(Map4D map) {
    this.tileOverlay = map.addTileOverlay(getOptions());
  }

  public void removeFromMap(Map4D map) {
    if (tileOverlay == null) {
      return;
    }
    tileOverlay.remove();
    tileOverlay = null;
  }

  public void setTemplateUrl(String url) {
    this.templateUrl = url;
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
    if (tileOverlay != null) {
      tileOverlay.setVisible(this.visible);
    }
  }

  public void setZIndex(double zIndex) {
    this.zIndex = zIndex;
    if (tileOverlay != null) {
      tileOverlay.setZIndex(this.zIndex);
    }
  }

   public MFTileOverlayOptions getOptions() {
    if (options == null) {
      options = new MFTileOverlayOptions();
    }

    fillOptions(options);
    return options;
  }

  private MFTileOverlayOptions fillOptions(MFTileOverlayOptions options) {
    MFTileProvider tileProvider = new MFUrlTileProvider() {
      @Override
      public String getTileUrl(int x, int y, int zoom, boolean _3dMode) {
        if (templateUrl == null) {
          return null;
        }
        String url;
        if (templateUrl.contains("{z}")) {
          url = templateUrl.replace("{z}", String.valueOf(zoom));
        }
        else {
          url = templateUrl.replace("{zoom}", String.valueOf(zoom));
        }
        url = url.replace("{x}", String.valueOf(x));
        url = url.replace("{y}", String.valueOf(y));
        return url;
      }
    };
    options.tileProvider(tileProvider);
    options.zIndex(zIndex);
    options.visible(visible);
    return options;
  }

   public Object getFeature() {
      return tileOverlay;
   }
}