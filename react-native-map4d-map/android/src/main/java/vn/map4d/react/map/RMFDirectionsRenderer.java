package vn.map4d.react.map;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.Animatable;
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

  private final DraweeHolder<?> logoHolder;
  private DataSource<CloseableReference<CloseableImage>> dataSource;
  private final ControllerListener<ImageInfo> mStartIconControllerListener =
    new BaseControllerListener<ImageInfo>() {
      @Override
      public void onFinalImageSet(
        String id,
        @javax.annotation.Nullable final ImageInfo imageInfo,
        @javax.annotation.Nullable Animatable animatable) {
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
                startIcon = MFBitmapDescriptorFactory.fromBitmap(bitmap);
              }
            }
          }
        } finally {
          dataSource.close();
          if (imageReference != null) {
            CloseableReference.closeSafely(imageReference);
          }
        }

        /** Uncomment after implement setStartIcon() method in Core **/
//        if (RMFDirectionsRenderer.this.directionsRenderer != null) {
//          RMFDirectionsRenderer.this.directionsRenderer.setStartIcon(startIcon);
//        }
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
          imageReference = dataSource.getResult();
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
          dataSource.close();
          if (imageReference != null) {
            CloseableReference.closeSafely(imageReference);
          }
        }

        /** Uncomment after implement setStartIcon() method in Core **/
//        if (RMFDirectionsRenderer.this.directionsRenderer != null) {
//          RMFDirectionsRenderer.this.directionsRenderer.setEndIcon(endIcon);
//        }
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
    startIcon = null;
    endIcon = null;
    startLabel = "";
    endLabel = "";
    logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolder.onAttach();
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
      options.endIcon(null);
    }
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
  }

  public void setActiveOutlineColor(@ColorInt int color) {
    this.activeOutlineColor = color;
  }

  public void setInactiveStrokeColor(@ColorInt int color) {
    this.inactiveStrokeColor = color;
  }

  public void setInactiveOutlineColor(@ColorInt int color) {
    this.inactiveOutlineColor = color;
  }

  public void setTitleColor(@ColorInt int color) {
    this.titleColor = color;
  }

  public void setStartLabel(@NonNull String label) {
    startLabel = label;
  }

  public void setEndLabel(@NonNull String label) {
    endLabel = label;
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
      dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
      DraweeController controller = Fresco.newDraweeControllerBuilder()
        .setImageRequest(imageRequest)
        .setControllerListener(mStartIconControllerListener)
        .setOldController(logoHolder.getController())
        .build();
      logoHolder.setController(controller);
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
      dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
      DraweeController controller = Fresco.newDraweeControllerBuilder()
        .setImageRequest(imageRequest)
        .setControllerListener(mEndIconControllerListener)
        .setOldController(logoHolder.getController())
        .build();
      logoHolder.setController(controller);
    }
  }
}
