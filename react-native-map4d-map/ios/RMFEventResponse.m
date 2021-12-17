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

NSString *const kRMFLatLngCoordinateResponseKey = @"location";
NSString *const kRMFPointCoordinateResponseKey = @"pixel";

@implementation RMFEventResponse

+ (NSString*) hexStringFromColor:(UIColor*) color {
  if (color != nil) {
    CGFloat r, g, b, a;
    [color getRed:&r green:&g blue:&b alpha:&a];
    return [NSString stringWithFormat:@"#%02lX%02lX%02lX%02lX", lroundf(r * 255), lroundf(g * 255), lroundf(b * 255), lroundf(a * 255)];
  }
  return @"";
}

+ (NSDictionary*)fromCoordinate:(CLLocationCoordinate2D)coordinate {
  return (@{
    @"latitude": @(coordinate.latitude),
    @"longitude": @(coordinate.longitude),
  });
}

+ (NSDictionary*)fromCameraPosition:(MFCameraPosition*) position {
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

+ (NSDictionary*)fromCoordinateBounds:(MFCoordinateBounds*)bounds {
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

+ (NSDictionary*)fromCGPoint:(CGPoint) point {
  return (@{ @"x": @(point.x), @"y": @(point.y) });
}

+ (NSDictionary*)fromCLLocation:(CLLocation *)location {
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

+ (NSDictionary *)fromCoordinate:(CLLocationCoordinate2D)location pixel:(CGPoint)pixel {
  return @{
    kRMFLatLngCoordinateResponseKey: [RMFEventResponse fromCoordinate:location],
    kRMFPointCoordinateResponseKey: [RMFEventResponse fromCGPoint:pixel]
  };
}

@end
