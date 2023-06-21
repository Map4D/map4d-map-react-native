//
//  RCTConvert+Map4dMap.h
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RCTConvert_Map4dMap_h
#define RCTConvert_Map4dMap_h

#import <React/RCTConvert.h>

@class RMFCoordinate;
@class MFCameraPosition;
@class RMFIcon;
@class MFCoordinateBounds;
@class RMFDirectionsMarkerOptions;

@interface RCTConvert(Map4dMap)

+ (RMFCoordinate *)RMFCoordinate:(id)json;
+ (NSArray<RMFCoordinate *> *)RMFCoordinateArray:(id)json;
+ (NSArray<NSArray<RMFCoordinate *> *> *)RMFCoordinateArrayArray:(id)json;
+ (MFCameraPosition *)MFCameraPosition:(id)json;
+ (MFCameraPosition *)MFCameraPosition:(id)json withDefaultCamera:(MFCameraPosition*)camera;
+ (RMFIcon *)RMFIcon:(id)json;
+ (MFCoordinateBounds *)MFCoordinateBounds:(id)json;
+ (RMFDirectionsMarkerOptions *)RMFDirectionsMarkerOptions:(id)json;

@end

#endif /* RCTConvert_Map4dMap_h */
