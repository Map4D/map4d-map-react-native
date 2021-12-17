//
//  RMFPolyline.m
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFPolyline.h"
#import "RMFEventResponse.h"

@implementation RMFPolyline

- (instancetype)init {
  if ((self = [super init])) {
    _map4dPolyline = [[RMFPolylineMap4d alloc] init];
    _map4dPolyline.reactPolyline = self;
    
    _coordinates = nil;
    _width = _map4dPolyline.width;
    _lineStyle = @"solid";//MFPolylineStyleSolid
    _color = _map4dPolyline.color;
    _zIndex = _map4dPolyline.zIndex;
    _visible = true;//!_map4dPolyline.isHidden
    _userData = nil;
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _map4dPolyline.map = mapView;
}

/** Properties */

- (void)setCoordinates:(NSArray<RMFCoordinate *> *)coordinates {
  _coordinates = coordinates;
  MFMutablePath* path = [[MFMutablePath alloc] init];
  for(int i = 0; i < coordinates.count; i++)
  {
    [path addCoordinate:coordinates[i].coordinate];
  }
  _map4dPolyline.path = path;
}

- (void)setWidth:(CGFloat)width {
  _width = width;
  _map4dPolyline.width = width;
}

- (void)setColor:(UIColor *)color {
  _color = color;
  _map4dPolyline.color = color;
}

- (void)setLineStyle:(NSString *)lineStyle {
  _lineStyle = lineStyle;
  if ([lineStyle isEqualToString:@"dotted"]) {
    _map4dPolyline.style = MFPolylineStyleDotted;
  } else {
    _map4dPolyline.style = MFPolylineStyleSolid;
  }
}

- (void)setZIndex:(float)zIndex {
  _zIndex = zIndex;
  _map4dPolyline.zIndex = zIndex;
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  _map4dPolyline.isHidden = !visible;
}

- (void)setUserInteractionEnabled:(BOOL)enabled {
  [super setUserInteractionEnabled:enabled];
  _map4dPolyline.userInteractionEnabled = enabled;
}

 - (void)setUserData:(NSDictionary *)userData {
   _userData = userData;
 }

/** Event */
- (void)didTapAtPixel:(CGPoint)pixel {
  if (!self.onPress) {
    return;
  }
  
  CLLocationCoordinate2D tapLocation = [_map4dPolyline.map.projection coordinateForPoint:pixel];
  NSMutableDictionary* response = [NSMutableDictionary dictionaryWithDictionary:[RMFEventResponse fromCoordinate:tapLocation
                                                                                                           pixel:pixel]];
  response[@"polyline"] = @{
    @"userData": _userData != nil ? _userData : @{}
  };
  response[@"action"] = @"polyline-press";
  
  self.onPress(response);
}

@end
