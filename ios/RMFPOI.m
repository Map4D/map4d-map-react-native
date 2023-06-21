//
//  RMFPOI.m
//  Map4dMap
//
//  Created by Huy Dang on 7/5/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFPOI.h"
#import <Foundation/Foundation.h>
#import "RMFEventResponse.h"

@implementation RMFPOI

- (instancetype)init {
  if ((self = [super init])) {
    _map4dPOI = [[RMFPOIMap4d alloc] init];
    _map4dPOI.reactPOI = self;
    
    _coordinate = _map4dPOI.position;
    _title = nil;//_map4dPOI.title;
    _titleColor = _map4dPOI.titleColor;
    _subtitle = nil;//_map4dPOI.subtitle;
    _poiType = nil;//_map4dPOI.type;
    _icon = nil;
    _zIndex = _map4dPOI.zIndex;
    _visible = true;//!_map4dPOI.isHidden;
    _userData = nil;
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  _map4dPOI.map = mapView;
}

/** Properties */

- (void)setCoordinate:(CLLocationCoordinate2D)coordinate {
  _coordinate = coordinate;
  _map4dPOI.position = coordinate;
}

- (void)setTitle:(NSString *)title {
  _title = title;
  _map4dPOI.title = title;
}

- (void)setTitleColor:(UIColor *)titleColor {
  _titleColor = titleColor;
  _map4dPOI.titleColor = titleColor;
}

- (void)setSubtitle:(NSString *)subtitle {
  _subtitle = subtitle;
  _map4dPOI.subtitle = subtitle;
}

- (void)setPoiType:(NSString *)poiType {
  _poiType = poiType;
  _map4dPOI.type = poiType;
}
- (void)setIcon:(RMFIcon *)icon {
  _icon = icon;
  if (icon == nil || icon.uri == nil) {
    _map4dPOI.icon = nil;
    return;
  }

  dispatch_async(dispatch_get_global_queue(0,0), ^{
    NSData * imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: icon.uri]];
    if (imageData != nil) {
      dispatch_async(dispatch_get_main_queue(), ^{
        UIImage* icon = [UIImage imageWithData:imageData];
        self->_map4dPOI.icon = [UIImage imageWithCGImage:[icon CGImage]
                                                   scale:[UIScreen mainScreen].scale
                                             orientation:icon.imageOrientation];
      });
    }
  });
}

- (void)setZIndex:(float)zIndex {
  _zIndex = zIndex;
  _map4dPOI.zIndex = zIndex;
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  _map4dPOI.isHidden = !visible;
}

- (void)setUserInteractionEnabled:(BOOL)enabled {
  [super setUserInteractionEnabled:enabled];
  _map4dPOI.userInteractionEnabled = enabled;
}

 - (void)setUserData:(NSDictionary *)userData {
   _userData = userData;
//   _map4dPOI.userData = userData;
 }

/** Event */

- (void)didTapAtPixel:(CGPoint)pixel {
  if (!self.onPress) {
    return;
  }
  
  CLLocationCoordinate2D tapLocation = [_map4dPOI.map.projection coordinateForPoint:pixel];
  NSMutableDictionary* response = [NSMutableDictionary dictionaryWithDictionary:[RMFEventResponse fromCoordinate:tapLocation
                                                                                                           pixel:pixel]];
  response[@"poi"] = @{
    kRMFLatLngCoordinateResponseKey: [RMFEventResponse fromCoordinate:_coordinate],
    @"title": _title,
    @"userData": _userData != nil ? _userData : @{}
  };
  response[@"action"] = @"poi-press";
  
  self.onPress(response);
}

@end
