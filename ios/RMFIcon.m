//
//  RMFIcon.m
//  Map4dMap
//
//  Created by Huy Dang on 7/13/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFIcon.h"
#import <Foundation/Foundation.h>

@implementation RMFIcon

- (instancetype _Nonnull) init {
  self = [super init];
  self.uri = nil;
  self.width = nil;
  self.height = nil;
  self.image = nil;
  return self;
}

- (void)setImage:(UIImage *)image {
  if ((image.size.width == [_width intValue] && image.size.height == [_height intValue]) || (_width == nil || _height == nil)) {
    _image = image;
  } else {
    CGSize newSize = CGSizeMake([_width intValue], [_height intValue]);
    UIGraphicsBeginImageContextWithOptions(newSize, NO, 0.0);
    [image drawInRect:CGRectMake(0, 0, newSize.width, newSize.height)];
    _image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
  }
}

@end
