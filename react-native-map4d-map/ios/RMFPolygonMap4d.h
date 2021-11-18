//
//  RMFPolygonMap4d.h
//  Map4dMap
//
//  Created by Huy Dang on 10/7/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFPolygonMap4d_h
#define RMFPolygonMap4d_h

#import <Map4dMap/Map4dMap.h>

@class RMFPolygon;

@interface RMFPolygonMap4d : MFPolygon

@property (nonatomic, weak) RMFPolygon *reactPolygon;

@end


#endif /* RMFPolygonMap4d_h */
