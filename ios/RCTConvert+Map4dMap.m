//
//  RCTConvert+Map4dMap.m
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RCTConvert+Map4dMap.h"
#import <React/RCTConvert+CoreLocation.h>
#import <Map4dMap/Map4dMap.h>
#import "RMFCoordinate.h"
#import "RMFIcon.h"
#import "RMFDirectionsMarkerOptions.h"

@implementation RCTConvert(Map4dMap)

+ (RMFCoordinate *)RMFCoordinate:(id)json {
    RMFCoordinate *coord = [RMFCoordinate new];
    coord.coordinate = [self CLLocationCoordinate2D:json];
    return coord;
}

RCT_ARRAY_CONVERTER(RMFCoordinate)

+ (NSArray<NSArray<RMFCoordinate *> *> *)RMFCoordinateArrayArray:(id)json {
    return RCTConvertArrayValue(@selector(RMFCoordinateArray:), json);
}

+ (MFCameraPosition *)MFCameraPosition:(id)json withDefaultCamera:(MFCameraPosition*)camera {
  double zoom = 0;
  double tilt = 0;
  double bearing = 0;
  CLLocationCoordinate2D target = CLLocationCoordinate2DMake(0, 0);
  if (camera != nil) {
    target = camera.target;
    zoom = camera.zoom;
    tilt = camera.tilt;
    bearing = camera.bearing;
  }
  
  json = [self NSDictionary:json];
  if (json[@"center"]) {
    target = [self CLLocationCoordinate2D:json[@"center"]];
  }
  
  if (json[@"zoom"]) {
    zoom = [self double:json[@"zoom"]];
  }
  
  if (json[@"tilt"]) {
    tilt = [self double:json[@"tilt"]];
  }
  
  if (json[@"bearing"]) {
    bearing = [self double:json[@"bearing"]];
  }
  
  return [[MFCameraPosition alloc] initWithTarget:target zoom:zoom tilt:tilt bearing:bearing];
}

+ (MFCameraPosition *)MFCameraPosition:(id)json {
  return [self MFCameraPosition:json withDefaultCamera:nil];
}

+ (RMFIcon *)RMFIcon:(id)json {
  json = [self NSDictionary:json];
  if (json[@"uri"]) {
    RMFIcon * icon = [[RMFIcon alloc] init];
    icon.uri = [self NSString:json[@"uri"]];
    if (json[@"width"]) {
      icon.width = [self NSNumber:json[@"width"]];
    }
    if (json[@"height"]) {
      icon.height = [self NSNumber:json[@"height"]];
    }
    return icon;
  }
  return nil;
}

+ (MFCoordinateBounds *)MFCoordinateBounds:(id)json {
  json = [self NSDictionary:json];
  CLLocationCoordinate2D northEast = [self CLLocationCoordinate2D:json[@"northEast"]];
  CLLocationCoordinate2D southWest = [self CLLocationCoordinate2D:json[@"southWest"]];
  return [[MFCoordinateBounds alloc] initWithCoordinate:northEast coordinate1:southWest];
}

+ (RMFDirectionsMarkerOptions *)RMFDirectionsMarkerOptions:(id)json {
  json = [self NSDictionary:json];
  RMFDirectionsMarkerOptions* options = [[RMFDirectionsMarkerOptions alloc] init];
  
  if (json[@"coordinate"]) {
    options.coordinate = [self CLLocationCoordinate2D:json[@"coordinate"]];
  }
  if (json[@"icon"]) {
    options.icon = [self RMFIcon:json[@"icon"]];
  }
  if (json[@"title"]) {
    options.title = [self NSString:json[@"title"]];
  }
  if (json[@"titleColor"]) {
    options.titleColor = [self UIColor:json[@"titleColor"]];
  }
  if (json[@"visible"]) {
    options.visible = [self BOOL:json[@"visible"]];
  }
  
  return options;
}

@end
