//
//  RMFIcon.h
//  Map4dMap
//
//  Created by Huy Dang on 7/13/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFIcon_h
#define RMFIcon_h

@interface RMFIcon : NSObject

@property (nonatomic, copy, nullable) NSString *uri;
@property (nonatomic, assign, nullable) NSNumber *width;
@property (nonatomic, assign, nullable) NSNumber *height;

@property (nonatomic, copy, nullable) UIImage* image;

- (instancetype _Nonnull) init;

@end

#endif /* RMFIcon_h */
