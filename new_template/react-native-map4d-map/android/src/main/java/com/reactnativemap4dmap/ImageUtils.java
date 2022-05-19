package com.reactnativemap4dmap;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.VectorDrawable;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.WindowManager;

import androidx.core.content.ContextCompat;
import androidx.core.graphics.drawable.DrawableCompat;

import vn.map4d.map.annotations.MFBitmapDescriptor;
import vn.map4d.map.annotations.MFBitmapDescriptorFactory;
import vn.map4d.map.annotations.RMFBitmapDescriptor;
import vn.map4d.map.core.MapContext;

class ImageUtils {

  private static DisplayMetrics metrics;

  static {
    final DisplayMetrics metrics = new DisplayMetrics();
    WindowManager wm = (WindowManager) MapContext.getContext().getSystemService(Context.WINDOW_SERVICE);

    wm.getDefaultDisplay().getMetrics(metrics);
    ImageUtils.metrics = metrics;

    DisplayMetrics realMetrics = null;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      realMetrics = new DisplayMetrics();
      wm.getDefaultDisplay().getRealMetrics(realMetrics);
    }
    if (realMetrics != null) {
      ImageUtils.metrics = realMetrics;
    }
  }

  static int getDrawableResourceByName(View view, String name) {
    return view.getResources().getIdentifier(
      name,
      "drawable",
      view.getContext().getPackageName());
  }

  static MFBitmapDescriptor getBitmapDescriptorByName(View view, String name) {
    return MFBitmapDescriptorFactory.fromResource(getDrawableResourceByName(view, name));
  }

  static MFBitmapDescriptor getBitmapByName(View view, String name) {
    return getBitmapByName(view, name, -1, -1);
  }

  static MFBitmapDescriptor getBitmapByName(View view, String name, int width, int height) {
    int resourceId = getDrawableResourceByName(view, name);
    Drawable drawable = ContextCompat.getDrawable(MapContext.getContext(), resourceId);
    if (drawable instanceof BitmapDrawable || drawable instanceof VectorDrawable) {
      Bitmap bitmap = createBitmapFromDrawable(drawable, width, height);
      return RMFBitmapDescriptor.create(bitmap, ImageUtils.metrics.densityDpi);
    }
    else {
      throw new IllegalArgumentException("The resource provided must be a Bitmap.");
    }
  }

  private static Bitmap createBitmapFromDrawable(Drawable drawable, int width, int height) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
      drawable = (DrawableCompat.wrap(drawable)).mutate();
    }
    int tWidth = width <= 0 ? drawable.getIntrinsicWidth(): width;
    int tHeight = height <= 0 ? drawable.getIntrinsicHeight(): height;

    Bitmap bitmap = Bitmap.createBitmap(
            tWidth,
            tHeight,
            Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(bitmap);
    drawable.setBounds(0, 0, tWidth, tHeight);
    drawable.draw(canvas);

    return bitmap;
  }
}
