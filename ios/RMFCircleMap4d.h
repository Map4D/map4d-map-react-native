//
//  RMFCircleMap4d.h
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFCircleMap4d_h
#define RMFCircleMap4d_h

#import <Map4dMap/Map4dMap.h>

@class RMFCircle;

@interface RMFCircleMap4d : MFCircle

@property (nonatomic, weak) RMFCircle *reactCircle;

@end


#endif /* RMFCircleMap4d_h */
