package com.reactnativemap4dmap;

import android.content.Context;

import vn.map4d.map.core.MFCoordinateBounds;
import vn.map4d.map.core.Map4D;
import vn.map4d.map.overlays.MFGroundOverlay;
import vn.map4d.map.overlays.MFGroundOverlayOptions;
import vn.map4d.map.overlays.MFGroundProvider;
import vn.map4d.map.overlays.MFUrlGroundProvider;

public class RMFGroundOverlay extends RMFFeature {

  private MFGroundOverlayOptions options;
  private MFGroundOverlay groundOverlay;

  private String urlTemplate;
  private boolean visible;
  private boolean override;
  private double zIndex;
  private MFCoordinateBounds bounds;

  public RMFGroundOverlay(Context context) {
    super(context);
    visible = true;
    override = false;
    zIndex = 0.0f;
    bounds = MFCoordinateBounds.world();
    urlTemplate = null;
  }

  public void addToMap(Map4D map) {
    this.groundOverlay = map.addGroundOverlay(getOptions());
  }

  public void removeFromMap(Map4D map) {
    if (groundOverlay == null) {
      return;
    }
    groundOverlay.remove();
    groundOverlay = null;
  }

  public void setTemplateUrl(String url) {
    this.urlTemplate = url;
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
    if (groundOverlay != null) {
      groundOverlay.setVisible(this.visible);
    }
  }

  public void setZIndex(double zIndex) {
    this.zIndex = zIndex;
    if (groundOverlay != null) {
      groundOverlay.setZIndex(this.zIndex);
    }
  }

  public void setBounds(MFCoordinateBounds bounds) {
    this.bounds = bounds;
  }

  public void setOverride(boolean override) {
    this.override = override;
  }

  public MFGroundOverlayOptions getOptions() {
    if (options == null) {
      options = new MFGroundOverlayOptions();
    }

    fillOptions(options);
    return options;
  }

  private MFGroundOverlayOptions fillOptions(MFGroundOverlayOptions options) {
    MFGroundProvider groundProvider = new MFUrlGroundProvider() {
      @Override
      public String getGroundUrl(int x, int y, int zoom, boolean _3dMode) {
        if (urlTemplate == null) {
          return null;
        }
        String url;
        if (urlTemplate.contains("{z}")) {
          url = urlTemplate.replace("{z}", String.valueOf(zoom));
        } else {
          url = urlTemplate.replace("{zoom}", String.valueOf(zoom));
        }
        url = url.replace("{x}", String.valueOf(x));
        url = url.replace("{y}", String.valueOf(y));
        return url;
      }
    };
    options.groundProvider(groundProvider);
    options.zIndex(zIndex);
    options.visible(visible);
    options.bounds(bounds);
    options.override(override);
    return options;
  }

  public Object getFeature() {
    return groundOverlay;
  }
}