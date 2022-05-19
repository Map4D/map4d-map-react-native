package com.reactnativemap4dmap;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.net.Uri;

import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.controller.ControllerListener;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.CloseableStaticBitmap;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.List;

import vn.map4d.map.annotations.MFBitmapDescriptor;
import vn.map4d.map.annotations.MFBitmapDescriptorFactory;
import vn.map4d.map.annotations.MFDirectionsRenderer;
import vn.map4d.map.annotations.MFDirectionsRendererOptions;
import vn.map4d.map.core.Map4D;
import vn.map4d.types.MFLocationCoordinate;

public class RMFDirectionsRenderer extends RMFFeature {

  private MFDirectionsRendererOptions options;
  private MFDirectionsRenderer directionsRenderer;

  private List<List<MFLocationCoordinate>> paths;
  private MFLocationCoordinate startLocation;
  private MFLocationCoordinate endLocation;
  private String jsonData;
  private float width;
  private int activedIndex;

  @ColorInt
  private int activeStrokeColor;

  @ColorInt
  private int activeOutlineColor;

  @ColorInt
  private int inactiveStrokeColor;

  @ColorInt
  private int inactiveOutlineColor;

  @ColorInt
  private int titleColor;

  @Nullable
  private MFBitmapDescriptor startIcon;

  @Nullable
  private MFBitmapDescriptor endIcon;

  private String startLabel;

  private String endLabel;

  private boolean originPOIVisible;

  private boolean destinationPOIVisible;

  private final DraweeHolder<?> startIconHolder;
  private final DraweeHolder<?> endIconHolder;
  private DataSource<CloseableReference<CloseableImage>> startIconDataSource;
  private DataSource<CloseableReference<CloseableImage>> endIconDataSource;
  private final ControllerListener<ImageInfo> mStartIconControllerListener =
    new BaseControllerListener<ImageInfo>() {
      @Override
      public void onFinalImageSet(
        String id,
        @javax.annotation.Nullable final ImageInfo imageInfo,
        @javax.annotation.Nullable Animatable animatable) {
        CloseableReference<CloseableImage> imageReference = null;
        try {
          imageReference = startIconDataSource.getResult();
          if (imageReference != null) {
            CloseableImage image = imageReference.get();
            if (image != null && image instanceof CloseableStaticBitmap) {
              CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
              Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
              if (bitmap != null) {
                bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                startIcon = MFBitmapDescriptorFactory.fromBitmap(bitmap);
              }
            }
          }
        } finally {
          startIconDataSource.close();
          if (imageReference != null) {
            CloseableReference.closeSafely(imageReference);
          }
        }

        if (RMFDirectionsRenderer.this.directionsRenderer != null) {
          RMFDirectionsRenderer.this.directionsRenderer.setStartIcon(startIcon);
        }
      }
    };

  private final ControllerListener<ImageInfo> mEndIconControllerListener =
    new BaseControllerListener<ImageInfo>() {
      @Override
      public void onFinalImageSet(
        String id,
        @javax.annotation.Nullable final ImageInfo imageInfo,
        @javax.annotation.Nullable Animatable animatable) {
        CloseableReference<CloseableImage> imageReference = null;
        try {
          imageReference = endIconDataSource.getResult();
          if (imageReference != null) {
            CloseableImage image = imageReference.get();
            if (image != null && image instanceof CloseableStaticBitmap) {
              CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
              Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
              if (bitmap != null) {
                bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                endIcon = MFBitmapDescriptorFactory.fromBitmap(bitmap);
              }
            }
          }
        } finally {
          endIconDataSource.close();
          if (imageReference != null) {
            CloseableReference.closeSafely(imageReference);
          }
        }

        if (RMFDirectionsRenderer.this.directionsRenderer != null) {
          RMFDirectionsRenderer.this.directionsRenderer.setEndIcon(endIcon);
        }
      }
    };

  public RMFDirectionsRenderer(Context context) {
    super(context);
    paths = new ArrayList<>();
    jsonData = null;
    width = 10.f;
    MFDirectionsRendererOptions optionsDefault = new MFDirectionsRendererOptions();
    startLocation = optionsDefault.getStartLocation();
    endLocation = optionsDefault.getEndLocation();
    activeStrokeColor = optionsDefault.getActiveStrokeColor();
    activeOutlineColor = optionsDefault.getActiveOutlineColor();
    inactiveStrokeColor = optionsDefault.getInactiveStrokeColor();
    inactiveOutlineColor = optionsDefault.getInactiveOutlineColor();
    titleColor = optionsDefault.getTitleColor();
    originPOIVisible = optionsDefault.isOriginPOIVisible();
    destinationPOIVisible = optionsDefault.isDestinationPOIVisible();
    startIcon = null;
    endIcon = null;
    startLabel = "";
    endLabel = "";
    startIconHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    startIconHolder.onAttach();
    endIconHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    endIconHolder.onAttach();
  }

  private GenericDraweeHierarchy createDraweeHierarchy() {
    return new GenericDraweeHierarchyBuilder(getResources())
      .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
      .setFadeDuration(0)
      .build();
  }

  @Override
  public void addToMap(Map4D map) {
    this.directionsRenderer = map.addDirectionsRenderer(getOptions());
  }

  @Override
  public void removeFromMap(Map4D map) {
    if (directionsRenderer == null) {
      return;
    }
    directionsRenderer.remove();
    directionsRenderer = null;
  }

  @Override
  public Object getFeature() {
    return directionsRenderer;
  }

  public MFDirectionsRendererOptions getOptions() {
    if (options == null) {
      options = new MFDirectionsRendererOptions();
    }
    fillOptions(options);
    return options;
  }

  private MFDirectionsRendererOptions fillOptions(MFDirectionsRendererOptions options) {
    List<List<MFLocationCoordinate>> paths = new ArrayList<>();
    for (int i = 0; i < this.paths.size(); ++i) {
      List<MFLocationCoordinate> path = this.paths.get(i);
      MFLocationCoordinate[] pathArray = new MFLocationCoordinate[path.size()];
      path.toArray(pathArray);
      paths.add(path);
    }
    options.paths(paths);
    options.startLocation(startLocation);
    options.endLocation(endLocation);
    options.activedIndex(activedIndex);
    options.jsonData(jsonData);
    options.width(width);
    if (!startLabel.isEmpty()) {
      options.startLabel(startLabel);
    }
    if (!endLabel.isEmpty()) {
      options.endLabel(endLabel);
    }
    if (startIcon != null) {
      options.startIcon(startIcon);
    }
    if (endIcon != null) {
      options.endIcon(endIcon);
    }
    options.originPOIVisible(originPOIVisible);
    options.destinationPOIVisible(destinationPOIVisible);
    options.activeStrokeColor(activeStrokeColor);
    options.activeOutlineColor(activeOutlineColor);
    options.inactiveStrokeColor(inactiveStrokeColor);
    options.inactiveOutlineColor(inactiveOutlineColor);
    options.titleColor(titleColor);
    return options;
  }

  public void setPaths(ReadableArray paths) {
    if (paths == null) {
      return;
    }

    this.paths = new ArrayList<>(paths.size());
    for (int i = 0; i < paths.size(); i++) {
      ReadableArray path = paths.getArray(i);
      List<MFLocationCoordinate> coordinates = new ArrayList<>();
      for (int j = 0; j < path.size(); j++) {
        ReadableMap coordinate = path.getMap(j);
        coordinates.add(new MFLocationCoordinate(
          coordinate.getDouble("latitude"),
          coordinate.getDouble("longitude")));
      }
      this.paths.add(coordinates);
    }
  }

  public void setStartLocation(ReadableMap data) {
    this.startLocation = new MFLocationCoordinate(data.getDouble("latitude"), data.getDouble("longitude"));
    if (directionsRenderer != null) {
      directionsRenderer.setStartLocation(this.startLocation);
    }
  }

  public void setEndLocation(ReadableMap data) {
    this.endLocation = new MFLocationCoordinate(data.getDouble("latitude"), data.getDouble("longitude"));
    if (directionsRenderer != null) {
      directionsRenderer.setEndLocation(this.endLocation);
    }
  }

  public void setJsonData(@NonNull String jsonData) {
    this.jsonData = jsonData;
    if (directionsRenderer != null) {
      directionsRenderer.setJsonData(this.jsonData);
    }
  }

  public void setActivedIndex(int activedIndex) {
    this.activedIndex = activedIndex;
    if (directionsRenderer != null) {
      directionsRenderer.setActivedIndex(this.activedIndex);
    }
  }

  public void setWidth(float width) {
    this.width = width;
    if (directionsRenderer != null) {
      directionsRenderer.setWidth(this.width);
    }
  }

  public void setActiveStrokeColor(@ColorInt int color) {
    this.activeStrokeColor = color;
    if (directionsRenderer != null) {
      directionsRenderer.setActiveStrokeColor(color);
    }
  }

  public void setActiveOutlineColor(@ColorInt int color) {
    this.activeOutlineColor = color;
    if (directionsRenderer != null) {
      directionsRenderer.setActiveOutlineColor(color);
    }
  }

  public void setInactiveStrokeColor(@ColorInt int color) {
    this.inactiveStrokeColor = color;
    if (directionsRenderer != null) {
      directionsRenderer.setInactiveStrokeColor(color);
    }
  }

  public void setInactiveOutlineColor(@ColorInt int color) {
    this.inactiveOutlineColor = color;
    if (directionsRenderer != null) {
      directionsRenderer.setInactiveOutlineColor(color);
    }
  }

  public void setTitleColor(@ColorInt int color) {
    this.titleColor = color;
    if (directionsRenderer != null) {
      directionsRenderer.setTitleColor(color);
    }
  }

  public void setStartLabel(@NonNull String label) {
    startLabel = label;
    if (directionsRenderer != null) {
      directionsRenderer.setStartLabel(startLabel);
    }
  }

  public void setEndLabel(@NonNull String label) {
    endLabel = label;
    if (directionsRenderer != null) {
      directionsRenderer.setEndLabel(endLabel);
    }
  }

  public void setOriginPOIVisible(boolean visible) {
    originPOIVisible = visible;
    if (directionsRenderer != null) {
      directionsRenderer.setOriginPOIVisible(visible);
    }
  }

  public void setDestinationPOIVisible(boolean visible) {
    destinationPOIVisible = visible;
    if (directionsRenderer != null) {
      directionsRenderer.setDestinationPOIVisible(visible);
    }
  }

  public void setStartIcon(String uri) {
    if (uri == null) {
      startIcon = null;
    }
    else if (uri.startsWith("http://") || uri.startsWith("https://") ||
      uri.startsWith("file://") || uri.startsWith("asset://") || uri.startsWith("data:")) {
      ImageRequest imageRequest = ImageRequestBuilder
        .newBuilderWithSource(Uri.parse(uri))
        .build();

      ImagePipeline imagePipeline = Fresco.getImagePipeline();
      startIconDataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
      DraweeController controller = Fresco.newDraweeControllerBuilder()
        .setImageRequest(imageRequest)
        .setControllerListener(mStartIconControllerListener)
        .setOldController(startIconHolder.getController())
        .build();
      startIconHolder.setController(controller);
    }
    else {
      startIcon = ImageUtils.getBitmapDescriptorByName(this, uri);
      if (startIcon != null) {
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

  public void setEndIcon(String uri) {
    if (uri == null) {
      endIcon = null;
    }
    else if (uri.startsWith("http://") || uri.startsWith("https://") ||
      uri.startsWith("file://") || uri.startsWith("asset://") || uri.startsWith("data:")) {
      ImageRequest imageRequest = ImageRequestBuilder
        .newBuilderWithSource(Uri.parse(uri))
        .build();

      ImagePipeline imagePipeline = Fresco.getImagePipeline();
      endIconDataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
      DraweeController controller = Fresco.newDraweeControllerBuilder()
        .setImageRequest(imageRequest)
        .setControllerListener(mEndIconControllerListener)
        .setOldController(endIconHolder.getController())
        .build();
      endIconHolder.setController(controller);
    }
    else {
      endIcon = ImageUtils.getBitmapDescriptorByName(this, uri);
      if (endIcon != null) {
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

  public void setOriginPOIOptions(ReadableMap map) {
    if (map == null) {
      return;
    }

    if (map.hasKey("coordinate")) {
      ReadableMap coordinate = map.getMap("coordinate");
      this.setStartLocation(coordinate);
    }

    if (map.hasKey("icon")) {
      ReadableMap icon = map.getMap("icon");
      if (icon.hasKey("uri")) {
        String uri = icon.getString("uri");
        this.setStartIcon(uri);
      }
    }

    if (map.hasKey("title")) {
      String title = map.getString("title");
      this.setStartLabel(title);
    }

    if (map.hasKey("titleColor")) {
      this.setTitleColor(map.getInt("titleColor"));
    }

    if (map.hasKey("visible")) {
      this.setOriginPOIVisible(map.getBoolean("visible"));
    }
  }

  public void setDestinationPOIOptions(ReadableMap map) {
    if (map == null) {
      return;
    }

    if (map.hasKey("coordinate")) {
      ReadableMap coordinate = map.getMap("coordinate");
      this.setEndLocation(coordinate);
    }

    if (map.hasKey("icon")) {
      ReadableMap icon = map.getMap("icon");
      if (icon.hasKey("uri")) {
        String uri = icon.getString("uri");
        this.setEndIcon(uri);
      }
    }

    if (map.hasKey("title")) {
      String title = map.getString("title");
      this.setEndLabel(title);
    }

    if (map.hasKey("titleColor")) {
      this.setTitleColor(map.getInt("titleColor"));
    }

    if (map.hasKey("visible")) {
      this.setDestinationPOIVisible(map.getBoolean("visible"));
    }
  }
}
