//
//  RMFEventResponse.m
//  Map4dMap
//
//  Created by Huy Dang on 7/8/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFEventResponse.h"
#import "RMFMarker.h"
#import "RMFCircle.h"
#import "RMFPolyline.h"
#import "RMFPolygon.h"
#import "RMFPOI.h"

@implementation RMFEventResponse

+ (NSString*) hexStringFromColor:(UIColor*) color {
  if (color != nil) {
    CGFloat r, g, b, a;
    [color getRed:&r green:&g blue:&b alpha:&a];
    return [NSString stringWithFormat:@"#%02lX%02lX%02lX%02lX", lroundf(r * 255), lroundf(g * 255), lroundf(b * 255), lroundf(a * 255)];
  }
  return @"";
}

+ (NSDictionary*)eventFromCoordinate:(CLLocationCoordinate2D)coordinate {
  return (@{
    @"latitude": @(coordinate.latitude),
    @"longitude": @(coordinate.longitude),
  });
}

+ (NSMutableDictionary*)eventFromCoordinate:(CLLocationCoordinate2D)coordinate
                                     action:(NSString*)action
                                 projection:(MFProjection*)projection
                                   userData:(NSDictionary*)userData {
  NSMutableDictionary* dict = [[NSMutableDictionary alloc]initWithDictionary:@{
    @"coordinate": @{
      @"latitude": @(coordinate.latitude),
      @"longitude": @(coordinate.longitude),
    }
  }];
  
  if (action != nil) {
    dict[@"action"] = action;
  }
  
  if (projection != nil) {
    CGPoint position = [projection pointForCoordinate:coordinate];
    dict[@"position"] = @{
      @"x": @(position.x),
      @"y": @(position.y),
    };
  }
  
  if (userData != nil) {
    dict[@"userData"] = userData;
  }
  
  return dict;
}

+ (NSDictionary*)eventFromMarker:(RMFMarker*) reactMarker action:(NSString*)action {
  MFMarker* marker = reactMarker.map4dMarker;
  CLLocationCoordinate2D coordinate = marker.position;
  return [self eventFromCoordinate:coordinate action:action projection:marker.map.projection userData:reactMarker.userData];
}

+ (NSDictionary*)eventFromCircle:(RMFCircle *)reactCircle action:(NSString*)action {
  MFCircle* circle = reactCircle.map4dCircle;
  CLLocationCoordinate2D coordinate = circle.position;
  return [self eventFromCoordinate:coordinate action:action projection:circle.map.projection userData:reactCircle.userData];
}

+ (NSDictionary*)eventFromUserPOI:(RMFPOI *)reactPOI action:(NSString*)action {
  MFPOI* poi = reactPOI.map4dPOI;
  CLLocationCoordinate2D coordinate = poi.position;
  NSMutableDictionary* dict = [self eventFromCoordinate:coordinate action:action projection:poi.map.projection userData:reactPOI.userData];
  dict[@"title"] = poi.title ? poi.title : @"";
  dict[@"titleColor"] = [self hexStringFromColor:poi.titleColor];
  dict[@"subtitle"] = poi.subtitle ? poi.subtitle : @"";
  dict[@"type"] = poi.type ? poi.type : @"";
  return dict;
}

+ (NSDictionary*)eventFromMap4dPOI:(MFPOI *)poi action:(NSString*)action {
  NSMutableDictionary* dict = [[NSMutableDictionary alloc]init];
  if (action != nil) {
    dict[@"action"] = action;
  }
  dict[@"title"] = poi.title ? poi.title : @"";
  dict[@"titleColor"] = [self hexStringFromColor:poi.titleColor];
  dict[@"subtitle"] = poi.subtitle ? poi.subtitle : @"";
  dict[@"type"] = poi.type ? poi.type : @"";
  return dict;
}

+ (NSDictionary*)eventFromPolyline:(RMFPolyline *)reactPolyline action:(NSString*)action {
//  MFPolyline* polyline = reactPolyline.map4dPolyline;
  NSMutableDictionary* dict = [[NSMutableDictionary alloc]init];
  if (action != nil) {
    dict[@"action"] = action;
  }
  if (reactPolyline.userData != nil) {
    dict[@"userData"] = reactPolyline.userData;
  }
  
  return dict;
}

+ (NSDictionary*)eventFromPolygon:(RMFPolygon *)reactPolygon action:(NSString *)action {
  NSMutableDictionary* dict = [[NSMutableDictionary alloc]init];
  if (action != nil) {
    dict[@"action"] = action;
  }
  if (reactPolygon.userData != nil) {
    dict[@"userData"] = reactPolygon.userData;
  }
  
  return dict;
}

+ (NSDictionary*)eventFromCameraPosition:(MFCameraPosition*) position {
  if (position == nil) {
    return (@{});
  }
  return (@{
    @"center": @{
        @"latitude": @(position.target.latitude),
        @"longitude": @(position.target.longitude)
    },
    @"zoom": @(position.zoom),
    @"bearing": @(position.bearing),
    @"tilt": @(position.tilt)
  });
}

+ (NSDictionary*)eventFromCoordinateBounds:(MFCoordinateBounds*)bounds {
  if (bounds == nil) {
    return @{};
  }
  return @{
    @"northEast": @{
      @"latitude": @(bounds.northEast.latitude),
      @"longitude": @(bounds.northEast.longitude)
    },
    @"southWest": @{
      @"latitude": @(bounds.southWest.latitude),
      @"longitude": @(bounds.southWest.longitude)
    }
  };
}

+ (NSDictionary*)eventFromCGPoint:(CGPoint) point {
  return (@{ @"x": @(point.x), @"y": @(point.y) });
}

+ (NSDictionary*)eventFromCLLocation:(CLLocation *)location {
  if (location == nil) {
    return (@{});
  }

  return (@{
    @"coordinate": @{
        @"latitude": @(location.coordinate.latitude),
        @"longitude": @(location.coordinate.longitude)
    },
    @"altitude": @(location.altitude),
    @"timestamp": @(location.timestamp.timeIntervalSinceReferenceDate * 1000),
    @"accuracy": @(location.horizontalAccuracy),
    @"altitudeAccuracy": @(location.verticalAccuracy),
    @"speed": @(location.speed),
    @"heading": @(location.course),
  });
}

@end
