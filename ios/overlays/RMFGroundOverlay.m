//
//  RMFGroundOverlay.m
//  react-native-map4d-map
//
//  Created by Huy Dang on 12/16/21.
//

#import "RMFGroundOverlay.h"

@interface RMFGroundURLConstructor : NSObject<MFTileURLConstructor>
@property(nonatomic, weak, nullable) RMFGroundOverlay *overlay;
@end

@implementation RMFGroundURLConstructor

- (NSURL * _Nullable)getTileUrlWithX:(NSUInteger)x y:(NSUInteger)y zoom:(NSUInteger)zoom is3dMode:(bool)is3dMode {
  NSString* url = _overlay.urlTemplate;
  if (url == nil) {
    return nil;
  }

  if ([url containsString:@"{z}"]) {
    url = [url stringByReplacingOccurrencesOfString:@"{z}" withString:[@(zoom) stringValue]];
  }
  else {
    url = [url stringByReplacingOccurrencesOfString:@"{zoom}" withString:[@(zoom) stringValue]];
  }
  url = [url stringByReplacingOccurrencesOfString:@"{x}" withString:[@(x) stringValue]];
  url = [url stringByReplacingOccurrencesOfString:@"{y}" withString:[@(y) stringValue]];
  return [NSURL URLWithString:url];
}

@end

@interface RMFGroundOverlay()
@property(nonatomic, strong, nonnull) RMFGroundURLConstructor* urlConstructor;
@property(nonatomic, strong, nullable) MFGroundOverlay* overlay;
@property(nonatomic, weak, nullable) RMFMapView* mapView;
@end

@implementation RMFGroundOverlay

- (instancetype)init {
  self = [super init];
  if (self) {
    _urlTemplate = nil;
    _zIndex = 0;
    _visible = YES;

    _overlay = nil;
    _mapView = nil;
    _urlConstructor = [[RMFGroundURLConstructor alloc] init];
    _urlConstructor.overlay = self;
  }
  return self;
}

- (void)createNewGroundOverlay {
  if (_overlay != nil) {
    _overlay.map = nil;
  }
  
  _overlay = [MFGroundOverlay groundOverlayWithBounds:_coordinateBounds
                                   tileURLConstructor:_urlConstructor
                                      overrideBaseMap:_overrideBaseMap];
  _overlay.zIndex = _zIndex;
  _overlay.isHidden = !_visible;
  if (_mapView != nil) {
    _overlay.map = _mapView;
  }
}

- (void)setUrlTemplate:(NSString *)urlTemplate {
  _urlTemplate = urlTemplate;
  [self createNewGroundOverlay];
}

- (void)setCoordinateBounds:(MFCoordinateBounds *)coordinateBounds {
  _coordinateBounds = coordinateBounds;
  [self createNewGroundOverlay];
}

- (void)setOverrideBaseMap:(BOOL)overrideBaseMap {
  _overrideBaseMap = overrideBaseMap;
  [self createNewGroundOverlay];
}

- (void)setZIndex:(float)zIndex {
  _zIndex = zIndex;
  if (_overlay != nil) {
    _overlay.zIndex = zIndex;
  }
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  if (_overlay != nil) {
    _overlay.isHidden = !visible;
  }
}

- (void)setMapView:(RMFMapView *)mapView {
  _mapView = mapView;
  if (_overlay != nil) {
    _overlay.map = mapView;
  }
}

@end
