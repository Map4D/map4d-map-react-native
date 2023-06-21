//
//  RMFPOIMap4d.h
//  Map4dMap
//
//  Created by Huy Dang on 7/5/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFPOIMap4d_h
#define RMFPOIMap4d_h

#import <Map4dMap/Map4dMap.h>

@class RMFPOI;

@interface RMFPOIMap4d : MFPOI

@property (nonatomic, weak) RMFPOI * reactPOI;

@end

#endif /* RMFPOIMap4d_h */
