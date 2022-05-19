//
//  RMFMarkerMap4d.h
//  Map4dMap
//
//  Created by Huy Dang on 5/4/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFMarkerMap4d_h
#define RMFMarkerMap4d_h

#import <Map4dMap/Map4dMap.h>

@class RMFMarker;
@interface RMFMarkerMap4d : MFMarker
@property (nonatomic, weak) RMFMarker *reactMarker;
@end

#endif /* RMFMarkerMap4d_h */
