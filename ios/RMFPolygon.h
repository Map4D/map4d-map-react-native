//
//  RMFPolygon.h
//  Map4dMap
//
//  Created by Huy Dang on 10/7/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFPolygon_h
#define RMFPolygon_h

#import <React/UIView+React.h>
#import <Map4dMap/Map4dMap.h>
#import "RMFPolygonMap4d.h"
#import "RMFMapView.h"
#import "RMFCoordinate.h"

@interface RMFPolygon : UIView

@property (nonatomic, strong) RMFPolygonMap4d* map4dPolygon;

@property (nonatomic, copy) RCTBubblingEventBlock _Nullable onPress;

@property (nonatomic, strong) NSArray<RMFCoordinate*>* coordinates;
@property (nonatomic, strong) NSArray<NSArray<RMFCoordinate*>*>* holes;

@property (nonatomic, assign) UIColor* fillColor;
@property (nonatomic, assign) CGFloat strokeWidth;
@property (nonatomic, assign) UIColor* strokeColor;

@property(nonatomic, assign) float zIndex;
@property(nonatomic, assign) BOOL visible;
@property(nonatomic, copy, nullable) NSDictionary * userData;


- (void)didTapAtPixel:(CGPoint)pixel;
- (void)setMapView:(RMFMapView* _Nullable)mapView;

@end

#endif /* RMFPolygon_h */
