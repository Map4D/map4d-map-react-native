//
//  RMFBuilding.h
//  react-native-map4d-map
//
//  Created by Huy Dang on 6/10/25.
//  Copyright © 2025 IOTLink. All rights reserved.
//

#ifndef RMFBuilding_h
#define RMFBuilding_h

#import <React/UIView+React.h>
#import "RMFBuildingMap4d.h"
#import "RMFMapView.h"

@interface RMFBuilding : UIView

@property(nonatomic, strong, nonnull) RMFBuildingMap4d * map4dBuilding;

@property(nonatomic, copy) RCTBubblingEventBlock _Nullable onPress;

@property (nonatomic, copy, nullable) NSString *name;
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;//position
@property (nonatomic, copy, nullable) NSString *modelUrl;
@property (nonatomic, copy, nullable) NSString *textureUrl;
@property (nonatomic, assign) double scale;
@property (nonatomic, assign) CGFloat bearing;
@property (nonatomic, assign) double elevation;
@property (nonatomic, assign) BOOL selected;
@property (nonatomic, assign) BOOL touchable;
@property (nonatomic, assign) BOOL visible;
@property (nonatomic, copy, nullable) NSDictionary * userData;

- (void)setMapView:(RMFMapView* _Nullable)mapView;

- (void)didTapAtPixel:(CGPoint)pixel;

@end


#endif /* RMFBuilding_h */
