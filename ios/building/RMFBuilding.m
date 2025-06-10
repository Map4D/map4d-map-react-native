//
//  RMFBuilding.m
//  react-native-map4d-map
//
//  Created by Huy Dang on 6/10/25.
//  Copyright © 2025 IOTLink. All rights reserved.
//

#import "RMFBuilding.h"
#import "RMFEventResponse.h"

@implementation RMFBuilding

- (instancetype)init {
  self = [super init];
  if (self) {
    _map4dBuilding = [[RMFBuildingMap4d alloc] init];
    _map4dBuilding.reactBuilding = self;

    _name = _map4dBuilding.name;
    _coordinate = _map4dBuilding.position;
    _modelUrl = _map4dBuilding.model;
    _textureUrl = _map4dBuilding.texture;
    _scale = _map4dBuilding.scale;
    _bearing = _map4dBuilding.bearing;
    _elevation = _map4dBuilding.elevation;
    _selected = _map4dBuilding.selected;
    _touchable = _map4dBuilding.userInteractionEnabled;
    _visible = !_map4dBuilding.isHidden;
    _userData = nil;
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _map4dBuilding.map = mapView;
}

- (void)didTapAtPixel:(CGPoint)pixel {
  if (self.onPress) {
    CLLocationCoordinate2D tapLocation = [_map4dBuilding.map.projection coordinateForPoint:pixel];
    NSMutableDictionary* response = [NSMutableDictionary dictionaryWithDictionary:[RMFEventResponse fromCoordinate:tapLocation
                                                                                                             pixel:pixel]];
    response[@"building"] = @{
      kRMFLatLngCoordinateResponseKey: [RMFEventResponse fromCoordinate:_map4dBuilding.position],
      @"userData": _userData != nil ? _userData : @{}
    };
    response[@"action"] = @"building-press";
    
    self.onPress(response);
  };
}

- (void)setName:(NSString *)name {
  _name = name;
  _map4dBuilding.name = name;
}

- (void)setCoordinate:(CLLocationCoordinate2D)coordinate {
  _coordinate = coordinate;
  _map4dBuilding.position = coordinate;
}

- (void)setModelUrl:(NSString *)modelUrl {
  _modelUrl = modelUrl;
  _map4dBuilding.model = modelUrl;
}

- (void)setTextureUrl:(NSString *)textureUrl {
  _textureUrl = textureUrl;
  _map4dBuilding.texture = textureUrl;
}

- (void)setScale:(double)scale {
  _scale = scale;
  _map4dBuilding.scale = scale;
}

- (void)setBearing:(CGFloat)bearing {
  _bearing = bearing;
  _map4dBuilding.bearing = bearing;
}

- (void)setElevation:(double)elevation {
  _elevation = elevation;
  _map4dBuilding.elevation = elevation;
}

- (void)setSelected:(BOOL)selected {
  _selected = selected;
  _map4dBuilding.selected = selected;
}

- (void)setTouchable:(BOOL)touchable {
  _touchable = touchable;
  _map4dBuilding.userInteractionEnabled = touchable;
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  _map4dBuilding.isHidden = !visible;
}

@end
