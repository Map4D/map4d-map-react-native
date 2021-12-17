//
//  RMFEventResponse.h
//  Map4dMap
//
//  Created by Huy Dang on 7/8/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef MFEventResponse_h
#define MFEventResponse_h

#import <CoreLocation/CoreLocation.h>

@class RMFMarker;
@class RMFCircle;
@class RMFPOI;
@class RMFPolyline;
@class RMFPolygon;

@class MFPOI;
@class MFProjection;
@class MFCameraPosition;
@class MFCoordinateBounds;

FOUNDATION_EXPORT NSString *const kRMFLatLngCoordinateResponseKey;
FOUNDATION_EXPORT NSString *const kRMFPointCoordinateResponseKey;

@interface RMFEventResponse : NSObject

+ (NSDictionary*)fromCoordinate:(CLLocationCoordinate2D)coordinate;
+ (NSDictionary*)fromCoordinate:(CLLocationCoordinate2D)location pixel:(CGPoint)pixel;
+ (NSDictionary*)fromCameraPosition:(MFCameraPosition*) position;
+ (NSDictionary*)fromCoordinateBounds:(MFCoordinateBounds*)bounds;
+ (NSDictionary*)fromCGPoint:(CGPoint) point;
+ (NSDictionary*)fromCLLocation:(CLLocation*) location;

@end

#endif /* RMFEventResponse_h */
