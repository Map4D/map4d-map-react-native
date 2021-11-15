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

    _map4dDirectionsRenderer.originTitle = @"Origin";
    _map4dDirectionsRenderer.destinationTitle = @"Destination";
    
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
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _map4dDirectionsRenderer.activedIndex = _activedIndex;
  _map4dDirectionsRenderer.map = mapView;
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

@end
