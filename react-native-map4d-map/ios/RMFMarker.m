//
//  RMFMarker.m
//  Map4dMap
//
//  Created by Huy Dang on 4/28/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFMarker.h"
#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "Map4dMap/Map4dMap.h"

@implementation RMFMarker

- (instancetype)init
{
  if ((self = [super init])) {
    _realMarker = [[MFMarker alloc] init];
//    _realMarker.position = CLLocationCoordinate2DMake(16.094145, 108.224987);
  }
  return self;
}

- (void)setCoordinate:(CLLocationCoordinate2D)coordinate {
  _realMarker.position = coordinate;
}

@end
