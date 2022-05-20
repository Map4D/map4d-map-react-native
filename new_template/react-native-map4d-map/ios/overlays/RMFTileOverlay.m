//
//  RMFTileOverlay.m
//  react-native-map4d-map
//
//  Created by Huy Dang on 12/15/21.
//

#import "RMFTileOverlay.h"

@implementation RMFTileURLConstructor

- (NSURL * _Nullable)getTileUrlWithX:(NSUInteger)x
                                   y:(NSUInteger)y
                                zoom:(NSUInteger)zoom
                            is3dMode:(bool)is3dMode {
  if (_reactTileOverlay.urlTemplate == nil) {
    return nil;
  }
  
  NSString* url = _reactTileOverlay.urlTemplate;
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

@implementation RMFTileOverlay

- (instancetype)init {
  if (self = [super init]) {
    RMFTileURLConstructor* constructor = [[RMFTileURLConstructor alloc] init];
    constructor.reactTileOverlay = self;
    
    _urlTileLayer = [MFURLTileLayer tileLayerWithURLConstructor:constructor];
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _urlTileLayer.map = mapView;
}

- (void)setUrlTemplate:(NSString *)urlTemplate {
  _urlTemplate = urlTemplate;
  if (_urlTileLayer.map != nil) {
    [_urlTileLayer clearTileCache];
  }
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  _urlTileLayer.isHidden = !visible;
}

- (void)setZIndex:(float)zIndex {
  _zIndex = zIndex;
  _urlTileLayer.zIndex = zIndex;
}

@end
