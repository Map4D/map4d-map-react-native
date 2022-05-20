//
//  RMFMarker.h
//  Map4dMap
//
//  Created by Huy Dang on 4/28/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFMarker_h
#define RMFMarker_h

#import <React/UIView+React.h>
#import <React/RCTBridge.h>
#import "RMFMarkerMap4d.h"
#import "RMFMapView.h"
#import "RMFIcon.h"

@interface RMFMarker : UIView

//@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) RMFMarkerMap4d * map4dMarker;

@property (nonatomic, copy) RCTBubblingEventBlock _Nullable onPress;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onPressInfoWindow;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onDragStart;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onDrag;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onDragEnd;

@property (nonatomic, assign) CLLocationCoordinate2D coordinate;//position
@property (nonatomic, assign) CGPoint anchor;
@property (nonatomic, assign) double elevation;
@property (nonatomic, assign) double rotation;
@property (nonatomic, assign) BOOL draggable;
@property (nonatomic, assign) CGPoint infoWindowAnchor;
@property (nonatomic, copy, nullable) NSString *title;
@property (nonatomic, copy, nullable) NSString *snippet;
@property (nonatomic, copy, nullable) RMFIcon *icon;
@property (nonatomic, assign) float zIndex;
@property (nonatomic, assign) BOOL visible;
@property (nonatomic, copy, nullable) NSDictionary * userData;


- (void)didBeginDraggingMarkerAtPixel:(CGPoint)pixel;

- (void)didEndDraggingMarkerAtPixel:(CGPoint)pixel;

- (void)didDragMarkerAtPixel:(CGPoint)pixel;

- (void)didTapInfoWindowAtPixel:(CGPoint)pixel;

- (void)didTapAtPixel:(CGPoint)pixel;

- (void)setMapView:(RMFMapView* _Nullable)mapView;

@end

#endif /* RMFMarker_h */
