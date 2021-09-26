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

@interface RMFEventResponse : NSObject

+ (NSDictionary*)eventFromCoordinate:(CLLocationCoordinate2D)coordinate;
+ (NSMutableDictionary*)eventFromCoordinate:(CLLocationCoordinate2D)coordinate
                                     action:(NSString*)action
                                 projection:(MFProjection*)projection
                                   userData:(NSDictionary*)userData;

+ (NSDictionary*)eventFromMarker:(RMFMarker*) marker action:(NSString*)action;
+ (NSDictionary*)eventFromCircle:(RMFCircle*) circle action:(NSString*)action;
+ (NSDictionary*)eventFromPolyline:(RMFPolyline*) line action:(NSString*)action;
+ (NSDictionary*)eventFromPolygon:(RMFPolygon*) fill action:(NSString*)action;

+ (NSDictionary*)eventFromMap4dPOI:(MFPOI*) poi action:(NSString*)action;
+ (NSDictionary*)eventFromUserPOI:(RMFPOI*) poi action:(NSString*)action;

+ (NSDictionary*)eventFromCameraPosition:(MFCameraPosition*) position;
+ (NSDictionary*)eventFromCoordinateBounds:(MFCoordinateBounds*)bounds;
+ (NSDictionary*)eventFromCGPoint:(CGPoint) point;
+ (NSDictionary*)eventFromCLLocation:(CLLocation*) location;

@end

#endif /* RMFEventResponse_h */
