//
//  RMFDirectionsMarkerOptions.m
//  Map4dMap React Native
//
//  Created by Huy Dang on 11/16/21.
//

#import "RMFDirectionsMarkerOptions.h"

@implementation RMFDirectionsMarkerOptions

- (instancetype)init {
  if (self = [super init]) {
    _coordinate = kCLLocationCoordinate2DInvalid;
    _icon = nil;
    _title = nil;
    _titleColor = nil;
    _visible = YES;
  }
  return self;
}

@end
