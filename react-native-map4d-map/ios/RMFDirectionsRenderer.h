//
//  RMFDirectionsRenderer.h
//  Map4dMap React Native
//
//  Created by Huy Dang on 11/15/21.
//

#ifndef RMFDirectionsRenderer_h
#define RMFDirectionsRenderer_h

#import <React/UIView+React.h>
#import <Map4dMap/Map4dMap.h>
#import "RMFDirectionsRendererMap4d.h"
#import "RMFCoordinate.h"
#import "RMFDirectionsMarkerOptions.h"

@class RMFMapView;

@interface RMFDirectionsRenderer : UIView

@property (nonatomic, strong, nonnull) RMFDirectionsRendererMap4d* map4dDirectionsRenderer;

@property (nonatomic, copy) RCTBubblingEventBlock _Nullable onPress;

@property (nonatomic, strong, nullable) NSArray<NSArray<RMFCoordinate*>*>* routes;
@property (nonatomic, strong, nullable) NSString* directions;
@property (nonatomic, assign) NSUInteger activedIndex;

@property(nonatomic, assign) CGFloat activeStrokeWidth;
@property(nonatomic, strong, nullable) UIColor* activeStrokeColor;
@property(nonatomic, assign) CGFloat activeOutlineWidth;
@property(nonatomic, strong, nullable) UIColor* activeOutlineColor;

@property(nonatomic, assign) CGFloat inactiveStrokeWidth;
@property(nonatomic, strong, nullable) UIColor* inactiveStrokeColor;
@property(nonatomic, assign) CGFloat inactiveOutlineWidth;
@property(nonatomic, strong, nullable) UIColor* inactiveOutlineColor;

@property(nonatomic, strong, nullable) RMFDirectionsMarkerOptions* originPOIOptions;
@property(nonatomic, strong, nullable) RMFDirectionsMarkerOptions* destinationPOIOptions;

- (void)setMapView:(RMFMapView* _Nullable)mapView;
- (void)didTapAtPixel:(CGPoint)pixel withRouteIndex:(NSInteger)routeIndex;

@end

#endif /* RMFDirectionsRenderer_h */
