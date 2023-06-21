//
//  RMFPolygon.m
//  Map4dMap
//
//  Created by Huy Dang on 10/7/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFPolygon.h"
#import "RMFEventResponse.h"

@implementation RMFPolygon

- (instancetype)init {
  if (self = [super init]) {
    _map4dPolygon = [[RMFPolygonMap4d alloc] init];
    _map4dPolygon.reactPolygon = self;
    
    _coordinates = nil;
    _holes = nil;
    _fillColor = _map4dPolygon.fillColor;
    _strokeColor = _map4dPolygon.strokeColor;
    _strokeWidth = _map4dPolygon.strokeWidth;
    _zIndex = _map4dPolygon.zIndex;
    _visible = true;
    _userData = nil;
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _map4dPolygon.map = mapView;
}

/** Properties */

- (void)setCoordinates:(NSArray<RMFCoordinate *> *)coordinates {
  _coordinates = coordinates;
  MFMutablePath* path = [[MFMutablePath alloc] init];
  for (int i = 0; i < coordinates.count; i++) {
    [path addCoordinate:coordinates[i].coordinate];
  }
  _map4dPolygon.path = path;
}

- (void)setHoles:(NSArray<NSArray<RMFCoordinate *> *> *)holes {
  _holes = holes;
  
  NSMutableArray<MFPath*>* polygonHoles = [[NSMutableArray alloc] init];
  for (int i = 0; i < holes.count; i++) {
    NSArray<RMFCoordinate*>* coordinates = [holes objectAtIndex:i];
    MFMutablePath* path = [[MFMutablePath alloc] init];
    for (int j = 0; j < coordinates.count; j++) {
      [path addCoordinate:coordinates[j].coordinate];
    }
    [polygonHoles addObject:path];
  }
  _map4dPolygon.holes = polygonHoles;
}

- (void)setFillColor:(UIColor *)fillColor {
  _fillColor = fillColor;
  _map4dPolygon.fillColor = fillColor;
}

- (void)setStrokeColor:(UIColor *)strokeColor {
  _strokeColor = strokeColor;
  _map4dPolygon.strokeColor = strokeColor;
}

- (void)setStrokeWidth:(CGFloat)strokeWidth {
  _strokeWidth = strokeWidth;
  _map4dPolygon.strokeWidth = strokeWidth;
}

- (void)setZIndex:(float)zIndex {
  _zIndex = zIndex;
  _map4dPolygon.zIndex = zIndex;
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  _map4dPolygon.isHidden = !visible;
}

- (void)setUserData:(NSDictionary *)userData {
  _userData = userData;
}
/** Event */
- (void)didTapAtPixel:(CGPoint)pixel {
  if (!self.onPress) {
    return;
  }
  
  CLLocationCoordinate2D tapLocation = [_map4dPolygon.map.projection coordinateForPoint:pixel];
  NSMutableDictionary* response = [NSMutableDictionary dictionaryWithDictionary:[RMFEventResponse fromCoordinate:tapLocation
                                                                                                           pixel:pixel]];
  response[@"polygon"] = @{
    @"userData": _userData != nil ? _userData : @{}
  };
  response[@"action"] = @"polygon-press";
  
  self.onPress(response);
}

@end
