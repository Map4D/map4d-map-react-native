//
//  RMFCircle.m
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFCircle.h"
#import <Foundation/Foundation.h>
#import "RMFEventResponse.h"

@implementation RMFCircle

- (instancetype)init {
  if ((self = [super init])) {
    _map4dCircle = [[RMFCircleMap4d alloc] init];
    _map4dCircle.reactCircle = self;

    _radius = _map4dCircle.radius;
    _fillColor = _map4dCircle.fillColor;
    _strokeWidth = _map4dCircle.strokeWidth;
    _strokeColor = _map4dCircle.strokeColor;
    _centerCoordinate = _map4dCircle.position;
    _zIndex = _map4dCircle.zIndex;
    _visible = true;//!_map4dCircle.isHidden;
    _userData = nil;
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _map4dCircle.map = mapView;
}

/** Property */
- (void)setCenterCoordinate:(CLLocationCoordinate2D)center {
  _centerCoordinate = center;
  _map4dCircle.position = center;
}

- (void)setRadius:(double)radius {
  _radius = radius;
  _map4dCircle.radius = radius;
}

- (void)setFillColor:(UIColor *)fillColor {
  _fillColor = fillColor;
  _map4dCircle.fillColor = fillColor;
}

- (void)setStrokeColor:(UIColor *)strokeColor {
  _strokeColor = strokeColor;
  _map4dCircle.strokeColor = strokeColor;
}

- (void)setStrokeWidth:(double)strokeWidth {
  _strokeWidth = strokeWidth;
  _map4dCircle.strokeWidth = strokeWidth;
}

- (void)setUserInteractionEnabled:(BOOL)enabled {
  [super setUserInteractionEnabled:enabled];
  _map4dCircle.userInteractionEnabled = enabled;
}

- (void)setZIndex:(float)zIndex {
  _zIndex = zIndex;
  _map4dCircle.zIndex = zIndex;
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  _map4dCircle.isHidden = !visible;
}

 - (void)setUserData:(NSDictionary *)userData {
   _userData = userData;
 }

/** Event */
- (void)didTapAtPixel:(CGPoint)pixel {
  if(!self.onPress) {
    return;
  }
  
  CLLocationCoordinate2D tapLocation = [_map4dCircle.map.projection coordinateForPoint:pixel];
  NSMutableDictionary* response = [NSMutableDictionary dictionaryWithDictionary:[RMFEventResponse fromCoordinate:tapLocation
                                                                                                           pixel:pixel]];
  response[@"circle"] = @{
    @"center": [RMFEventResponse fromCoordinate:_centerCoordinate],
    @"radius": @(_radius),
    @"userData": _userData != nil ? _userData : @{}
  };
  response[@"action"] = @"circle-press";
  
  self.onPress(response);
}

@end
