package vn.map4d.react.map;

import android.view.View;

import vn.map4d.map.annotations.MFBitmapDescriptor;
import vn.map4d.map.annotations.MFBitmapDescriptorFactory;

class ImageUtils {

  static int getDrawableResourceByName(View view, String name) {
    return view.getResources().getIdentifier(
      name,
      "drawable",
      view.getContext().getPackageName());
  }

  static MFBitmapDescriptor getBitmapDescriptorByName(View view, String name) {
    return MFBitmapDescriptorFactory.fromResource(getDrawableResourceByName(view, name));
  }
}
