//
//  RMFDirectionsMarkerOptions.h
//  Map4dMap React Native
//
//  Created by Huy Dang on 11/16/21.
//

#ifndef RMFDirectionsMarkerOptions_h
#define RMFDirectionsMarkerOptions_h

#import "RMFIcon.h"
#import <CoreLocation/CoreLocation.h>

@interface RMFDirectionsMarkerOptions : NSObject

@property (nonatomic, assign) CLLocationCoordinate2D coordinate;
@property (nonatomic, strong, nullable) RMFIcon* icon;
@property (nonatomic, strong, nullable) NSString* title;
@property (nonatomic, strong, nullable) UIColor* titleColor;
@property (nonatomic, assign) BOOL visible;

@end

#endif /* RMFDirectionsMarkerOptions_h */
