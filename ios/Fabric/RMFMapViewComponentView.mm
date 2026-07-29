//
//  RMFMapViewComponentView.mm
//  Map4dMap
//
//  Fabric (New Architecture) ComponentView for RMFMapView.
//
//  This wraps the existing, unmodified RMFMapView (ios/RMFMapView.h/.m) as
//  `self.contentView`, translating Fabric props/events to and from the same
//  properties/event blocks that RMFMapViewManager (Paper) already uses. All
//  of RMFMapView's own logic (overlay wiring, event payload building) stays
//  untouched; only the glue layer here is new.
//

#import "RMFMapViewComponentView.h"

#import <react/renderer/components/Map4dMapSpec/ComponentDescriptors.h>
#import <react/renderer/components/Map4dMapSpec/EventEmitters.h>
#import <react/renderer/components/Map4dMapSpec/Props.h>
#import <react/utils/FollyConvert.h>

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>

#import "RMFMapView.h"
#import "RMFEventResponse.h"
#import "RMFMarker.h"
#import "RMFMarkerMap4d.h"
#import "RMFCircle.h"
#import "RMFCircleMap4d.h"
#import "RMFPolyline.h"
#import "RMFPolylineMap4d.h"
#import "RMFPolygon.h"
#import "RMFPolygonMap4d.h"
#import "RMFPOI.h"
#import "RMFPOIMap4d.h"
#import "RMFBuilding.h"
#import "RMFBuildingMap4d.h"
#import "RMFDirectionsRenderer.h"
#import "RMFDirectionsRendererMap4d.h"

using namespace facebook::react;

@interface RMFMapViewComponentView () <MFMapViewDelegate>
@end

@implementation RMFMapViewComponentView {
  RMFMapView *_mapView;
  BOOL _didApplyInitialProps;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RMFMapViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RMFMapViewProps>();
    _props = defaultProps;

    _mapView = [[RMFMapView alloc] initWithFrame:self.bounds];
    _mapView.delegate = self;
    [self setUpEventBlocks];

    self.contentView = _mapView;
  }
  return self;
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];

  _mapView.delegate = nil;
  _mapView = [[RMFMapView alloc] initWithFrame:self.bounds];
  _mapView.delegate = self;
  [self setUpEventBlocks];
  self.contentView = _mapView;

  // The recycled instance above is a brand-new RMFMapView with its own
  // intrinsic SDK defaults; force -updateProps: to fully reapply every prop
  // to it next time, same as on first mount.
  _didApplyInitialProps = NO;
}

#pragma mark - Event bridging (RMFMapView's NSDictionary-based blocks -> Fabric EventEmitter)

- (void)setUpEventBlocks
{
  __weak __typeof(self) weakSelf = self;

  _mapView.onMapReady = ^(NSDictionary *event) {
    [weakSelf emitMapReadyEvent];
  };

  _mapView.onPress = ^(NSDictionary *event) {
    [weakSelf emitPressEvent:event];
  };

  _mapView.onPoiPress = ^(NSDictionary *event) {
    [weakSelf emitPoiPressEvent:event];
  };

  _mapView.onBuildingPress = ^(NSDictionary *event) {
    [weakSelf emitBuildingPressEvent:event];
  };

  _mapView.onPlacePress = ^(NSDictionary *event) {
    [weakSelf emitPlacePressEvent:event];
  };

  _mapView.onDataSourceFeaturePress = ^(NSDictionary *event) {
    [weakSelf emitDataSourceFeaturePressEvent:event];
  };

  _mapView.onCameraMove = ^(NSDictionary *event) {
    [weakSelf emitCameraChangeEvent:event forSelector:@selector(onCameraMove:)];
  };

  _mapView.onCameraMoveStart = ^(NSDictionary *event) {
    [weakSelf emitCameraChangeEvent:event forSelector:@selector(onCameraMoveStart:)];
  };

  _mapView.onCameraIdle = ^(NSDictionary *event) {
    [weakSelf emitCameraChangeEvent:event forSelector:@selector(onCameraIdle:)];
  };

  _mapView.onMyLocationButtonPress = ^(NSDictionary *event) {
    [weakSelf emitMyLocationButtonPressEvent:event];
  };
}

- (const std::shared_ptr<const RMFMapViewEventEmitter>)mapEventEmitter
{
  if (!_eventEmitter) {
    return nullptr;
  }
  return std::dynamic_pointer_cast<const RMFMapViewEventEmitter>(_eventEmitter);
}

+ (RMFMapViewEventEmitter::OnPressLocation)locationFromDict:(NSDictionary *)location
{
  return {
    .latitude = [location[@"latitude"] doubleValue],
    .longitude = [location[@"longitude"] doubleValue],
  };
}

+ (RMFMapViewEventEmitter::OnPressPixel)pixelFromDict:(NSDictionary *)pixel
{
  return {
    .x = [pixel[@"x"] doubleValue],
    .y = [pixel[@"y"] doubleValue],
  };
}

- (void)emitMapReadyEvent
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  emitter->onMapReady(RMFMapViewEventEmitter::OnMapReady{});
}

- (void)emitPressEvent:(NSDictionary *)event
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  emitter->onPress(RMFMapViewEventEmitter::OnPress{
    .location = [RMFMapViewComponentView locationFromDict:event[@"location"]],
    .pixel = [RMFMapViewComponentView pixelFromDict:event[@"pixel"]],
    .action = std::string([event[@"action"] UTF8String]),
  });
}

- (void)emitPoiPressEvent:(NSDictionary *)event
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  NSDictionary *poi = event[@"poi"];
  emitter->onPoiPress(RMFMapViewEventEmitter::OnPoiPress{
    .location = [RMFMapViewComponentView locationFromDict:event[@"location"]],
    .pixel = [RMFMapViewComponentView pixelFromDict:event[@"pixel"]],
    .poi =
        {
          .id = std::string([poi[@"id"] UTF8String]),
          .title = std::string([poi[@"title"] UTF8String]),
          .location = [RMFMapViewComponentView locationFromDict:poi[kRMFLatLngCoordinateResponseKey]],
        },
    .action = std::string([event[@"action"] UTF8String]),
  });
}

- (void)emitBuildingPressEvent:(NSDictionary *)event
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  NSDictionary *building = event[@"building"];
  emitter->onBuildingPress(RMFMapViewEventEmitter::OnBuildingPress{
    .location = [RMFMapViewComponentView locationFromDict:event[@"location"]],
    .pixel = [RMFMapViewComponentView pixelFromDict:event[@"pixel"]],
    .building =
        {
          .id = std::string([building[@"id"] UTF8String]),
          .name = std::string([building[@"name"] UTF8String]),
          .location = [RMFMapViewComponentView locationFromDict:building[kRMFLatLngCoordinateResponseKey]],
        },
    .action = std::string([event[@"action"] UTF8String]),
  });
}

- (void)emitPlacePressEvent:(NSDictionary *)event
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  NSDictionary *place = event[@"place"];
  emitter->onPlacePress(RMFMapViewEventEmitter::OnPlacePress{
    .location = [RMFMapViewComponentView locationFromDict:event[@"location"]],
    .pixel = [RMFMapViewComponentView pixelFromDict:event[@"pixel"]],
    .place =
        {
          .name = std::string([place[@"name"] UTF8String]),
          .location = [RMFMapViewComponentView locationFromDict:place[kRMFLatLngCoordinateResponseKey]],
        },
    .action = std::string([event[@"action"] UTF8String]),
  });
}

- (void)emitDataSourceFeaturePressEvent:(NSDictionary *)event
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  NSDictionary *feature = event[@"feature"];
  id properties = feature[@"properties"];
  emitter->onDataSourceFeaturePress(RMFMapViewEventEmitter::OnDataSourceFeaturePress{
    .location = [RMFMapViewComponentView locationFromDict:event[@"location"]],
    .pixel = [RMFMapViewComponentView pixelFromDict:event[@"pixel"]],
    .feature =
        {
          .source = std::string([feature[@"source"] UTF8String]),
          .sourceLayer = std::string([feature[@"sourceLayer"] UTF8String]),
          .layerType = std::string([feature[@"layerType"] UTF8String]),
          .properties = properties != nil ? convertIdToFollyDynamic(properties) : folly::dynamic(nullptr),
          .location = [RMFMapViewComponentView locationFromDict:feature[@"location"]],
        },
    .action = std::string([event[@"action"] UTF8String]),
  });
}

- (void)emitCameraChangeEvent:(NSDictionary *)event forSelector:(SEL)selector
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  NSDictionary *center = event[@"center"];
  RMFMapViewEventEmitter::OnCameraMove payload{
    .center = [RMFMapViewComponentView locationFromDict:center],
    .zoom = [event[@"zoom"] doubleValue],
    .bearing = [event[@"bearing"] doubleValue],
    .tilt = [event[@"tilt"] doubleValue],
    .action = std::string([event[@"action"] UTF8String]),
  };

  if (selector == @selector(onCameraMoveStart:)) {
    emitter->onCameraMoveStart(RMFMapViewEventEmitter::OnCameraMoveStart{
      payload.center, payload.zoom, payload.bearing, payload.tilt, payload.action});
  } else if (selector == @selector(onCameraIdle:)) {
    emitter->onCameraIdle(RMFMapViewEventEmitter::OnCameraIdle{
      payload.center, payload.zoom, payload.bearing, payload.tilt, payload.action});
  } else {
    emitter->onCameraMove(payload);
  }
}

- (void)emitMyLocationButtonPressEvent:(NSDictionary *)event
{
  auto emitter = [self mapEventEmitter];
  if (!emitter) {
    return;
  }
  emitter->onMyLocationButtonPress(RMFMapViewEventEmitter::OnMyLocationButtonPress{
    .action = std::string([event[@"action"] UTF8String]),
  });
}

#pragma mark - Props

- (void)updateProps:(const facebook::react::Props::Shared &)props oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<const RMFMapViewProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const RMFMapViewProps>(props);

  // `oldViewProps` on the very first call is our own default-constructed
  // RMFMapViewProps (see -initWithFrame:), not "whatever the underlying SDK
  // view's own native default happens to be". If a JS value happens to equal
  // our declared C++ default (e.g. showsBuildings omitted -> defaults to
  // true on both sides), a plain diff would skip calling the setter, leaving
  // the SDK's own intrinsic default in place instead -- which may not agree.
  // Since MFMapView.js has no JS-level defaultProps, omitted props are the
  // common case, so force every setter to run at least once on first mount.
  BOOL isInitialUpdate = !_didApplyInitialProps;
  _didApplyInitialProps = YES;

  if (isInitialUpdate || oldViewProps.mapID != newViewProps.mapID) {
    _mapView.mapIdProp = RCTNSStringFromString(newViewProps.mapID);
  }

  if (isInitialUpdate || oldViewProps.mapStyle != newViewProps.mapStyle) {
    NSString *mapStyleJSON = RCTNSStringFromString(newViewProps.mapStyle);
    if (mapStyleJSON.length > 0) {
      MFMapStyle *mapStyle = [[MFMapStyle alloc] initWithJSONString:mapStyleJSON];
      [_mapView setMapStyle:mapStyle];
    }
  }

  if (isInitialUpdate || oldViewProps.mapType != newViewProps.mapType) {
    _mapView.mapTypeProp = RCTNSStringFromString(newViewProps.mapType);
  }

  BOOL cameraChanged = oldViewProps.camera.target.latitude != newViewProps.camera.target.latitude ||
      oldViewProps.camera.target.longitude != newViewProps.camera.target.longitude ||
      oldViewProps.camera.zoom != newViewProps.camera.zoom ||
      oldViewProps.camera.bearing != newViewProps.camera.bearing ||
      oldViewProps.camera.tilt != newViewProps.camera.tilt;
  if (isInitialUpdate || cameraChanged) {
    CLLocationCoordinate2D target =
        CLLocationCoordinate2DMake(newViewProps.camera.target.latitude, newViewProps.camera.target.longitude);
    _mapView.cameraProp = [[MFCameraPosition alloc] initWithTarget:target
                                                                zoom:newViewProps.camera.zoom
                                                                tilt:newViewProps.camera.tilt
                                                             bearing:newViewProps.camera.bearing];
  }

  if (isInitialUpdate || oldViewProps.showsMyLocationButton != newViewProps.showsMyLocationButton) {
    _mapView.showsMyLocationButton = newViewProps.showsMyLocationButton;
  }

  if (isInitialUpdate || oldViewProps.showsMyLocation != newViewProps.showsMyLocation) {
    _mapView.showsMyLocation = newViewProps.showsMyLocation;
  }

  if (isInitialUpdate || oldViewProps.showsBuildings != newViewProps.showsBuildings) {
    _mapView.showsBuildings = newViewProps.showsBuildings;
  }

  if (isInitialUpdate || oldViewProps.showsPOIs != newViewProps.showsPOIs) {
    _mapView.showsPOIs = newViewProps.showsPOIs;
  }

  if (isInitialUpdate || oldViewProps.zoomGesturesEnabled != newViewProps.zoomGesturesEnabled) {
    _mapView.zoomGesturesEnabled = newViewProps.zoomGesturesEnabled;
  }

  if (isInitialUpdate || oldViewProps.scrollGesturesEnabled != newViewProps.scrollGesturesEnabled) {
    _mapView.scrollGesturesEnabled = newViewProps.scrollGesturesEnabled;
  }

  if (isInitialUpdate || oldViewProps.rotateGesturesEnabled != newViewProps.rotateGesturesEnabled) {
    _mapView.rotateGesturesEnabled = newViewProps.rotateGesturesEnabled;
  }

  if (isInitialUpdate || oldViewProps.tiltGesturesEnabled != newViewProps.tiltGesturesEnabled) {
    _mapView.tiltGesturesEnabled = newViewProps.tiltGesturesEnabled;
  }

  [super updateProps:props oldProps:oldProps];
}

#pragma mark - Children mounting
//
// RMFMapView.m already implements the RCTComponent-era insertReactSubview:/
// removeReactSubview: to wire markers/polygons/etc into the underlying SDK
// map (via e.g. `[marker setMapView:self]`), including a fallback that
// recurses into `reactSubviews` for wrapper views it doesn't recognize
// directly (this is what lets the Fabric Interop Layer's wrapper for the
// still-unmigrated overlay ViewManagers -- RMFMarker, RMFCircle, etc. --
// resolve to the real view). We only need to redirect Fabric's mounting
// calls into that existing logic instead of the default `self` container.
// NOT calling `[super mountChildComponentView:...]` is intentional: these
// overlay "views" are not meant to become real UIKit subviews of the map;
// RMFMapView's own insertReactSubview:/removeReactSubview: never did that
// either (see the "-Wobjc-missing-super-calls" pragma there).

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [(id<RCTComponent>)_mapView insertReactSubview:(id<RCTComponent>)childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [(id<RCTComponent>)_mapView removeReactSubview:(UIView *)childComponentView];
}

#pragma mark - MFMapViewDelegate
//
// Forwarded verbatim from RMFMapViewManager.m (Paper) -- RMFMapView's own
// instance methods already build the NSDictionary payloads and invoke the
// onXxx blocks wired up in -setUpEventBlocks above.

- (BOOL)mapview:(MFMapView *)mapView didTapMarker:(MFMarker *)marker
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFMarkerMap4d *rMarker = (RMFMarkerMap4d *)marker;
  [rMarker.reactMarker didTapAtPixel:map.lastTapPixel];
  return NO;
}

- (void)mapview:(MFMapView *)mapView didBeginDraggingMarker:(MFMarker *)marker
{
  if ([marker isKindOfClass:[RMFMarkerMap4d class]]) {
    RMFMapView *map = (RMFMapView *)mapView;
    RMFMarkerMap4d *rMarker = (RMFMarkerMap4d *)marker;
    [rMarker.reactMarker didBeginDraggingMarkerAtPixel:map.lastLongPressPixel];
  }
}

- (void)mapview:(MFMapView *)mapView didEndDraggingMarker:(MFMarker *)marker
{
  if ([marker isKindOfClass:[RMFMarkerMap4d class]]) {
    RMFMapView *map = (RMFMapView *)mapView;
    RMFMarkerMap4d *rMarker = (RMFMarkerMap4d *)marker;
    [rMarker.reactMarker didEndDraggingMarkerAtPixel:map.lastLongPressPixel];
  }
}

- (void)mapview:(MFMapView *)mapView didDragMarker:(MFMarker *)marker
{
  if ([marker isKindOfClass:[RMFMarkerMap4d class]]) {
    RMFMapView *map = (RMFMapView *)mapView;
    RMFMarkerMap4d *rMarker = (RMFMarkerMap4d *)marker;
    [rMarker.reactMarker didDragMarkerAtPixel:map.lastPanPixel];
  }
}

- (void)mapview:(MFMapView *)mapView didTapInfoWindowOfMarker:(MFMarker *)marker
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFMarkerMap4d *rMarker = (RMFMarkerMap4d *)marker;
  [rMarker.reactMarker didTapInfoWindowAtPixel:map.lastTapPixel];
}

- (void)mapview:(MFMapView *)mapView didTapPolyline:(MFPolyline *)polyline
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFPolylineMap4d *rPolyline = (RMFPolylineMap4d *)polyline;
  [rPolyline.reactPolyline didTapAtPixel:map.lastTapPixel];
}

- (void)mapview:(MFMapView *)mapView didTapPolygon:(MFPolygon *)polygon
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFPolygonMap4d *rPolygon = (RMFPolygonMap4d *)polygon;
  [rPolygon.reactPolygon didTapAtPixel:map.lastTapPixel];
}

- (void)mapview:(MFMapView *)mapView didTapCircle:(MFCircle *)circle
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFCircleMap4d *rCircle = (RMFCircleMap4d *)circle;
  [rCircle.reactCircle didTapAtPixel:map.lastTapPixel];
}

- (void)mapView:(MFMapView *)mapView willMove:(BOOL)gesture
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  [reactMapView willMove:gesture];
}

- (void)mapView:(MFMapView *)mapView movingCameraPosition:(MFCameraPosition *)position
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  [reactMapView movingCameraPosition:position];
}

- (void)mapView:(MFMapView *)mapView idleAtCameraPosition:(MFCameraPosition *)position
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  [reactMapView idleAtCameraPosition:position];
}

- (void)mapView:(MFMapView *)mapView didTapAtCoordinate:(CLLocationCoordinate2D)coordinate
{
  RMFMapView *map = (RMFMapView *)mapView;
  [map didTapAtCoordinate:coordinate];
}

- (void)mapView:(MFMapView *)mapView didTapPOI:(MFPOI *)poi
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFPOIMap4d *rPOI = (RMFPOIMap4d *)poi;
  [rPOI.reactPOI didTapAtPixel:map.lastTapPixel];
}

- (void)mapView:(MFMapView *)mapView
    didTapPOIWithPlaceID:(NSString *)placeID
                     name:(NSString *)name
                 location:(CLLocationCoordinate2D)location
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  [reactMapView didTapPOIWithPlaceID:placeID name:name location:location];
}

- (void)mapView:(MFMapView *)mapView didTapBuilding:(MFBuilding *)building
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFBuildingMap4d *rBuilding = (RMFBuildingMap4d *)building;
  [rBuilding.reactBuilding didTapAtPixel:map.lastTapPixel];
}

- (void)mapView:(MFMapView *)mapView
    didTapBuildingWithBuildingID:(NSString *)buildingID
                             name:(NSString *)name
                         location:(CLLocationCoordinate2D)location
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  [reactMapView didTapBuildingWithBuildingID:buildingID name:name location:location];
}

- (void)mapView:(MFMapView *)mapView didTapPlaceWithName:(NSString *)name location:(CLLocationCoordinate2D)location
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  [reactMapView didTapPlaceWithName:name location:location];
}

- (void)mapView:(MFMapView *)mapView
    didTapDataSourceFeature:(MFDataSourceFeature *)feature
                    location:(CLLocationCoordinate2D)location
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  [reactMapView didTapDataSourceFeature:feature location:location];
}

- (void)mapView:(MFMapView *)mapView
    didTapDirectionsRenderer:(MFDirectionsRenderer *)renderer
                   routeIndex:(NSUInteger)routeIndex
{
  RMFMapView *map = (RMFMapView *)mapView;
  RMFDirectionsRendererMap4d *rRenderer = (RMFDirectionsRendererMap4d *)renderer;
  [rRenderer.reactRenderer didTapAtPixel:map.lastTapPixel withRouteIndex:routeIndex];
}

- (BOOL)didTapMyLocationButtonForMapView:(MFMapView *)mapView
{
  RMFMapView *reactMapView = (RMFMapView *)mapView;
  return [reactMapView didTapMyLocationButton];
}

- (UIView *)mapView:(MFMapView *)mapView markerInfoWindow:(MFMarker *)marker
{
  return nil;
}

@end

// Not called by the current codegen path: package.json declares
// `codegenConfig.ios.componentProvider`, so modern React Native resolves
// "RMFMapView" via NSClassFromString() directly rather than crawling this
// file for a `<Name>Cls(void)` function. Kept anyway for RN versions in this
// library's supported range whose codegen predates/ignores
// `ios.componentProvider` and only knows the older crawl-based discovery.
Class<RCTComponentViewProtocol> RMFMapViewCls(void)
{
  return RMFMapViewComponentView.class;
}
