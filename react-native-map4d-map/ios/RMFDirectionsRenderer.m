//
//  RMFDirectionsRenderer.m
//  Map4dMap React Native
//
//  Created by Huy Dang on 11/15/21.
//

#import "RMFDirectionsRenderer.h"

@implementation RMFDirectionsRenderer

- (instancetype)init {
  if (self = [super init]) {
    _map4dDirectionsRenderer = [[RMFDirectionsRendererMap4d alloc] init];
    _map4dDirectionsRenderer.reactRenderer = self;
    
    _routes = nil;
    _directions = nil;
    
    _activedIndex = _map4dDirectionsRenderer.activedIndex;

    _activeStrokeColor = _map4dDirectionsRenderer.activeStrokeColor;
    _activeStrokeWidth = _map4dDirectionsRenderer.activeStrokeWidth;
    _activeOutlineColor = _map4dDirectionsRenderer.activeOutlineColor;
    _activeOutlineWidth = _map4dDirectionsRenderer.activeOutlineWidth;

    _inactiveStrokeColor = _map4dDirectionsRenderer.inactiveStrokeColor;
    _inactiveStrokeWidth = _map4dDirectionsRenderer.inactiveStrokeWidth;
    _inactiveOutlineColor = _map4dDirectionsRenderer.inactiveOutlineColor;
    _inactiveOutlineWidth = _map4dDirectionsRenderer.inactiveOutlineWidth;
    
    _originPOIOptions = nil;
    _destinationPOIOptions = nil;
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _map4dDirectionsRenderer.activedIndex = _activedIndex;
  _map4dDirectionsRenderer.map = (MFMapView*)mapView;
}

- (void)didTapRouteWithIndex:(NSUInteger)routeIndex {
  if (!self.onPress) return;
  self.onPress(@{
    @"action":@"directions-press",
    @"routeIndex": @(routeIndex)
  });
}

- (void)setRoutes:(NSArray<NSArray<RMFCoordinate *> *> *)routes {
  _routes = routes;
  NSMutableArray<MFPath*>* paths = [NSMutableArray arrayWithCapacity:routes.count];
  for (int i = 0; i < routes.count; i++) {
    NSArray<RMFCoordinate*>* route = [routes objectAtIndex:i];
    MFMutablePath* path = [[MFMutablePath alloc] init];
    for (int j = 0; j < route.count; j++) {
      [path addCoordinate:route[j].coordinate];
    }
    
    [paths addObject:path];
  }
  
  if (paths.count > 0) {
    _map4dDirectionsRenderer.routes = paths;
  }
  else {
    _map4dDirectionsRenderer.routes = nil;
  }
}

- (void)setDirections:(NSString *)json {
  _directions = json;
  [_map4dDirectionsRenderer setRoutesWithJson:json];
}

- (void)setActivedIndex:(NSUInteger)activedIndex {
  _activedIndex = activedIndex;
  _map4dDirectionsRenderer.activedIndex = activedIndex;
}

- (void)setActiveStrokeColor:(UIColor *)color {
  _activeStrokeColor = color;
  _map4dDirectionsRenderer.activeStrokeColor = color;
}

- (void)setActiveStrokeWidth:(CGFloat)width {
  _activeStrokeWidth = width;
  _map4dDirectionsRenderer.activeStrokeWidth = width;
}

- (void)setActiveOutlineColor:(UIColor *)color {
  _activeOutlineColor = color;
  _map4dDirectionsRenderer.activeOutlineColor = color;
}

- (void)setActiveOutlineWidth:(CGFloat)width {
  _activeOutlineWidth = width;
  _map4dDirectionsRenderer.activeOutlineWidth = width;
}

- (void)setInactiveStrokeColor:(UIColor *)color {
  _inactiveStrokeColor = color;
  _map4dDirectionsRenderer.inactiveStrokeColor = color;
}

- (void)setInactiveStrokeWidth:(CGFloat)width {
  _inactiveStrokeWidth = width;
  _map4dDirectionsRenderer.inactiveStrokeWidth = width;
}

- (void)setInactiveOutlineColor:(UIColor *)color {
  _inactiveOutlineColor = color;
  _map4dDirectionsRenderer.inactiveOutlineColor = color;
}

- (void)setInactiveOutlineWidth:(CGFloat)width {
  _inactiveOutlineWidth = width;
  _map4dDirectionsRenderer.inactiveOutlineWidth = width;
}

- (void)setOriginPOIOptions:(RMFDirectionsMarkerOptions *)options {
  _originPOIOptions = options;
  
  _map4dDirectionsRenderer.originPosition = options.coordinate;
  _map4dDirectionsRenderer.originTitle = options.title;
  _map4dDirectionsRenderer.originTitleColor = options.titleColor;
  
  if (options.icon == nil || options.icon.uri == nil) {
    _map4dDirectionsRenderer.originIcon = nil;
  }
  else {
    dispatch_async(dispatch_get_global_queue(0,0), ^{
      NSData * imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: options.icon.uri]];
      if (imageData != nil) {
        dispatch_async(dispatch_get_main_queue(), ^{
          UIImage* icon = [UIImage imageWithData:imageData];
          UIImage* scaleIcon = [UIImage imageWithCGImage:[icon CGImage]
                                                   scale:[UIScreen mainScreen].scale
                                             orientation:icon.imageOrientation];
          self->_map4dDirectionsRenderer.originIcon = scaleIcon;
        });
      }
    });
  }
}

- (void)setDestinationPOIOptions:(RMFDirectionsMarkerOptions *)options {
  _destinationPOIOptions = options;
  
  _map4dDirectionsRenderer.destinationPosition = options.coordinate;
  _map4dDirectionsRenderer.destinationTitle = options.title;
  _map4dDirectionsRenderer.destinationTitleColor = options.titleColor;
  
  if (options.icon == nil || options.icon.uri == nil) {
    _map4dDirectionsRenderer.destinationIcon = nil;
  }
  else {
    dispatch_async(dispatch_get_global_queue(0,0), ^{
      NSData * imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: options.icon.uri]];
      if (imageData != nil) {
        dispatch_async(dispatch_get_main_queue(), ^{
          UIImage* icon = [UIImage imageWithData:imageData];
          UIImage* scaleImage = [UIImage imageWithCGImage:[icon CGImage]
                                                    scale:[UIScreen mainScreen].scale
                                              orientation:icon.imageOrientation];
          self->_map4dDirectionsRenderer.destinationIcon = scaleImage;
        });
      }
    });
  }
}

@end