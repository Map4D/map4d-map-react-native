package com.reactnativemap4dmap;

import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Animatable;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;

import com.facebook.react.bridge.ReadableMap;

import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.controller.ControllerListener;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.imagepipeline.image.CloseableStaticBitmap;
import com.facebook.imagepipeline.core.ImagePipeline;

import vn.map4d.map.core.*;
import vn.map4d.map.annotations.*;

import androidx.annotation.ColorInt;

import vn.map4d.types.MFLocationCoordinate;

import javax.annotation.Nullable;

public class RMFPOI extends RMFFeature {
  private MFPOIOptions options;
  private MFLocationCoordinate position;
  private String title;
  private @ColorInt int titleColor;
  private String subTitle;
  private String type;
  private MFBitmapDescriptor iconBitmapDescriptor;
  private float zIndex;
  private MFPOI poi;

  private final DraweeHolder<?> logoHolder;
  private DataSource<CloseableReference<CloseableImage>> dataSource;
  private final ControllerListener<ImageInfo> mLogoControllerListener =
    new BaseControllerListener<ImageInfo>() {
      @Override
      public void onFinalImageSet(
          String id,
          @Nullable final ImageInfo imageInfo,
          @Nullable Animatable animatable) {
        CloseableReference<CloseableImage> imageReference = null;
        try {
          imageReference = dataSource.getResult();
          if (imageReference != null) {
            CloseableImage image = imageReference.get();
            if (image != null && image instanceof CloseableStaticBitmap) {
              CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
              Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
              if (bitmap != null) {
                bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                iconBitmapDescriptor = MFBitmapDescriptorFactory.fromBitmap(bitmap);
              }
            }
          }
        } finally {
          dataSource.close();
          if (imageReference != null) {
            CloseableReference.closeSafely(imageReference);
          }
        }

        if (RMFPOI.this.poi != null) {
          RMFPOI.this.poi.setIcon(iconBitmapDescriptor);
        }
      }
    };

  public RMFPOI(Context context) {
    super(context);
    this.position = new MFLocationCoordinate(0, 0); 
    this.title = "";
    this.subTitle = "";
    this.titleColor = Color.BLACK;
    this.type = "";
    this.zIndex = 0.0f;
    logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolder.onAttach();
  }

  private GenericDraweeHierarchy createDraweeHierarchy() {
    return new GenericDraweeHierarchyBuilder(getResources())
      .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
      .setFadeDuration(0)
      .build();
  }

  public void setCoordinate(ReadableMap data) {
    this.position = new MFLocationCoordinate(data.getDouble("latitude"), data.getDouble("longitude"));
    if (poi != null) {
      poi.setPosition(this.position);
    }
  }

  public void setTitle(String title) {
    this.title = title;
    if (poi != null) {
      poi.setTitle(this.title);
    }
  }

  public void setTitleColor(@ColorInt int titleColor) {
    this.titleColor = titleColor;
    if (poi != null) {
      poi.setTitleColor(this.titleColor);
    }
  }

  public void setSubTitle(String subTitle) {
    this.subTitle = subTitle;
    if (poi != null) {
      poi.setSubTitle(this.subTitle);
    }
  }

  public void setType(String type) {
    this.type = type;
    if (poi != null) {
      poi.setType(this.type);
    }
  }

  public void setIcon(ReadableMap map) {
    String uri = null;
    if (map.hasKey("uri")) {
      uri = map.getString("uri");
    }

    if (uri == null) {
      iconBitmapDescriptor = null;
    }
    else if (uri.startsWith("http://") || uri.startsWith("https://") ||
      uri.startsWith("file://") || uri.startsWith("asset://") || uri.startsWith("data:")) {
      ImageRequest imageRequest = ImageRequestBuilder
        .newBuilderWithSource(Uri.parse(uri))
        .build();

      ImagePipeline imagePipeline = Fresco.getImagePipeline();
      dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
      DraweeController controller = Fresco.newDraweeControllerBuilder()
        .setImageRequest(imageRequest)
        .setControllerListener(mLogoControllerListener)
        .setOldController(logoHolder.getController())
        .build();
      logoHolder.setController(controller);
    }
    else {
      iconBitmapDescriptor = ImageUtils.getBitmapDescriptorByName(this, uri);
      if (iconBitmapDescriptor != null) {
        int drawableId = ImageUtils.getDrawableResourceByName(this, uri);
        Bitmap iconBitmap = BitmapFactory.decodeResource(getResources(), drawableId);
        if (iconBitmap == null) { // VectorDrawable or similar
          Drawable drawable = getResources().getDrawable(drawableId);
          iconBitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
          drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
          Canvas canvas = new Canvas(iconBitmap);
          drawable.draw(canvas);
        }
      }
    }
  }

  public void setZIndex(double zIndex) {
    this.zIndex = (float) zIndex;
    if (poi != null) {
      poi.setZIndex(this.zIndex);
    }
  }

  public void addToMap(Map4D map) {
    this.poi = map.addPOI(getOptions());
  }

  public void removeFromMap(Map4D map) {
    if (poi == null) {
      return;
    }
    poi.remove();
    poi = null;
  }

  public MFPOIOptions getOptions() {
    if (options == null) {
      options = new MFPOIOptions();
    }
    fillOptions(options);
    return options;
  }

  private MFPOIOptions fillOptions(MFPOIOptions options) {
    options.position(position);
    options.title(title);
    options.titleColor(titleColor);
    options.subtitle(subTitle);
    options.type(type);
    options.zIndex(zIndex);
    options.icon(iconBitmapDescriptor);
    return options;
  }

  public Object getFeature() {
    return poi;
  }
}