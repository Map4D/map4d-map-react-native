//
//  RMFPOI.h
//  Map4dMap
//
//  Created by Huy Dang on 7/5/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFPOI_h
#define RMFPOI_h

#import <React/UIView+React.h>
#import "RMFPOIMap4d.h"
#import "RMFMapView.h"
#import "RMFIcon.h"

@interface RMFPOI : UIView

@property (nonatomic, strong, nonnull) RMFPOIMap4d * map4dPOI;

@property (nonatomic, copy) RCTBubblingEventBlock _Nullable onPress;

@property (nonatomic, assign) CLLocationCoordinate2D coordinate;
@property (nonatomic, strong, nullable) NSString *title;
@property (nonatomic, strong, nullable) UIColor* titleColor;
@property (nonatomic, strong, nullable) NSString* subtitle;
@property (nonatomic, strong, nullable) NSString* poiType;
@property (nonatomic, copy, nullable) RMFIcon *icon;
@property (nonatomic, assign) float zIndex;
@property (nonatomic, assign) BOOL visible;
@property (nonatomic, copy, nullable) NSDictionary * userData;

- (void)didTapAtPixel:(CGPoint)pixel;
- (void)setMapView:(RMFMapView* _Nullable)mapView;

@end

#endif /* RMFPOI_h */
