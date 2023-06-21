//
//  RMFPolylineMap4d.h
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFPolylineMap4d_h
#define RMFPolylineMap4d_h

#import <Map4dMap/Map4dMap.h>

@class RMFPolyline;

@interface RMFPolylineMap4d : MFPolyline

@property (nonatomic, weak) RMFPolyline *reactPolyline;

@end

#endif /* RMFPolylineMap4d_h */
