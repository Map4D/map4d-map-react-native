//
//  RMFMapView.m
//  Map4dMap
//
//  Created by Huy Dang on 4/27/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFMapView.h"
#import <Foundation/Foundation.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTComponent.h>
#import <React/RCTBridge.h>
#import <React/RCTLog.h>
#import "RMFMarker.h"
#import "RMFCircle.h"
#import "RMFPolyline.h"
#import "RMFPolygon.h"
#import "RMFPOI.h"
#import "RMFDirectionsRenderer.h"
#import "RMFTileOverlay.h"
#import "RMFEventResponse.h"

@class GLKView;

@interface MFMapView()
- (void)glkView:(nonnull GLKView *)view drawInRect:(CGRect)rect;
@end

@implementation RMFMapView {
  bool _didCallOnMapReady;
    NSMutableArray<UIView *> *_reactSubviews;
}

- (instancetype _Nonnull)init {
  if ((self = [super init])) {
    _didCallOnMapReady = false;
    _reactSubviews = [NSMutableArray new];
  }
  return self;
}

- (instancetype _Nonnull )initWithFrame: (CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    _didCallOnMapReady = false;
    _reactSubviews = [NSMutableArray new];
  }
  return self;
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
  if ([subview isKindOfClass:[RMFMarker class]]) {
    RMFMarker *marker = (RMFMarker*)subview;
    [marker setMapView:self];
    //[super insertReactSubview:marker atIndex:atIndex];
  }
  else if ([subview isKindOfClass:[RMFCircle class]]) {
    RMFCircle *circle = (RMFCircle*)subview;
    [circle setMapView:self];
    //[super insertReactSubview:circle atIndex:atIndex];
  }
  else if ([subview isKindOfClass:[RMFPolyline class]]) {
    RMFPolyline* polyline = (RMFPolyline*)subview;
    [polyline setMapView:self];
    //[super insertReactSubview:polyline atIndex:atIndex];
  }
  else if ([subview isKindOfClass:[RMFPolygon class]]) {
    RMFPolygon* polygon = (RMFPolygon*)subview;
    [polygon setMapView:self];
  }
  else if ([subview isKindOfClass:[RMFPOI class]]) {
    RMFPOI* poi = (RMFPOI*)subview;
    [poi setMapView:self];
    //[super insertReactSubview:poi atIndex:atIndex];
  }
  else if ([subview isKindOfClass:[RMFDirectionsRenderer class]]) {
    RMFDirectionsRenderer* renderer = (RMFDirectionsRenderer*)subview;
    [renderer setMapView:self];
  }
  else if ([subview isKindOfClass:[RMFTileOverlay class]]) {
    RMFTileOverlay* overlay = (RMFTileOverlay*)subview;
    [overlay setMapView:self];
  }
  else {
    NSArray<id<RCTComponent>> *childSubviews = [subview reactSubviews];
    for (int i = 0; i < childSubviews.count; i++) {
      [self insertReactSubview:(UIView *)childSubviews[i] atIndex:atIndex];
    }
  }

  [_reactSubviews insertObject:(UIView *)subview atIndex:(NSUInteger) atIndex];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)removeReactSubview:(UIView *)subview {
  if ([subview isKindOfClass:[RMFMarker class]]) {
    RMFMarker* marker = (RMFMarker*)subview;
    marker.map4dMarker.map = nil;
  }
  else if ([subview isKindOfClass:[RMFCircle class]]) {
    RMFCircle* circle = (RMFCircle*)subview;
    circle.map4dCircle.map = nil;
  }
  else if ([subview isKindOfClass:[RMFPolyline class]]) {
    RMFPolyline* polyline = (RMFPolyline*)subview;
    polyline.map4dPolyline.map = nil;
  }
  else if ([subview isKindOfClass:[RMFPolygon class]]) {
    RMFPolygon* polygon = (RMFPolygon*)subview;
    polygon.map4dPolygon.map = nil;
  }
  else if ([subview isKindOfClass:[RMFPOI class]]) {
    RMFPOI* poi = (RMFPOI*)subview;
    poi.map4dPOI.map = nil;
  }
  else if ([subview isKindOfClass:[RMFDirectionsRenderer class]]) {
    RMFDirectionsRenderer* renderer = (RMFDirectionsRenderer*)subview;
    [renderer setMapView:nil];
  }
  else if ([subview isKindOfClass:[RMFTileOverlay class]]) {
    RMFTileOverlay* overlay = (RMFTileOverlay*)subview;
    [overlay setMapView:nil];
    
  }
  else {
    NSArray<id<RCTComponent>> *childSubviews = [subview reactSubviews];
    for (int i = 0; i < childSubviews.count; i++) {
      [self removeReactSubview:(UIView *)childSubviews[i]];
    }
  }
  [_reactSubviews removeObject:(UIView *)subview];
}
#pragma clang diagnostic pop

- (void)setCameraProp:(MFCameraPosition *)cameraProp {
  _cameraProp = cameraProp;
  self.camera = cameraProp;
}

- (void)setMapTypeProp:(NSString *)mapTypeProp {
  _mapTypeProp = mapTypeProp;
  if ([@"raster" caseInsensitiveCompare:mapTypeProp] == NSOrderedSame) {
    self.mapType = MFMapTypeRaster;
  }
  else {
    self.mapType = MFMapTypeRoadmap;
  }
}

- (void)setShowsBuildings:(BOOL)showsBuildings {
  _showsBuildings = showsBuildings;
  [self setBuildingsEnabled:showsBuildings];
}

- (void)setShowsPOIs:(BOOL)showsPOIs {
  _showsPOIs = showsPOIs;
  [self setPOIsEnabled:showsPOIs];
}

- (void)setShowsMyLocationButton:(BOOL)showsMyLocationButton {
  _showsMyLocationButton = showsMyLocationButton;
  self.settings.myLocationButton = showsMyLocationButton;
}

- (void)setShowsMyLocation:(BOOL)showsMyLocation {
  _showsMyLocation = showsMyLocation;
  [self setMyLocationEnabled:showsMyLocation];
}

- (void)didTapAtCoordinate:(CLLocationCoordinate2D)coordinate {
  if (!self.onPress) return;
  self.onPress([RMFEventResponse eventFromCoordinate:coordinate action:@"coordinate-press" projection:nil userData:nil]);
}

- (void)didTapPOIWithPlaceID:(NSString *)placeID name:(NSString *)name location:(CLLocationCoordinate2D)location {
  if (!self.onPoiPress) return;
  self.onPoiPress(@{
    @"action":@"poi-press",
    @"placeID": placeID,
    @"name": name,
    @"location": @{
      @"latitude": @(location.latitude),
      @"longitude": @(location.longitude)
    }
  });
}

- (void)didTapBuildingWithBuildingID:(NSString *)buildingID name:(NSString *)name location:(CLLocationCoordinate2D)location {
  if (!self.onBuildingPress) return;
  self.onBuildingPress(@{
    @"action":@"building-press",
    @"buildingID": buildingID,
    @"name": name,
    @"location": @{
      @"latitude": @(location.latitude),
      @"longitude": @(location.longitude)
    }
  });
}

- (void)didTapPlaceWithName:(NSString*)name location:(CLLocationCoordinate2D)location {
  if (!self.onPlacePress) return;
  self.onPlacePress(@{
    @"action":@"place-press",
    @"name": name,
    @"location": @{
      @"latitude": @(location.latitude),
      @"longitude": @(location.longitude)
    }
  });
}

- (BOOL)didTapMyLocationButton {
  if (self.onMyLocationButtonPress) {
    self.onMyLocationButtonPress(@{});
  }
  return false;
}

- (void)didShouldChangeMapMode {
  if (self.onShouldChangeMapMode) {
    self.onShouldChangeMapMode(@{});
  }
}

- (void)willMove: (BOOL) gesture {
  if (!self.onCameraMoveStart) return;
    NSMutableDictionary* data = [[NSMutableDictionary alloc] initWithDictionary:[RMFEventResponse eventFromCameraPosition: self.camera]];
    data[@"gesture"] = [NSNumber numberWithBool:gesture];
    self.onCameraMoveStart(data);
}

- (void)movingCameraPosition: (MFCameraPosition*) position {
  if (!self.onCameraMove) return;
  self.onCameraMove([RMFEventResponse eventFromCameraPosition:position]);
}

- (void)didChangeCameraPosition:(MFCameraPosition *)position {
  //TODO
}

- (void)idleAtCameraPosition: (MFCameraPosition *) position {
  if (!self.onCameraIdle) return;
  self.onCameraIdle([RMFEventResponse eventFromCameraPosition:position]);
}

- (void)on3dModeChange: (bool) is3DMode {
  if (!self.onModeChange) return;
  if (is3DMode) {
    self.onModeChange(@{@"mode": @"3d"});
  }
  else {
    self.onModeChange(@{@"mode": @"2d"});
  }
}

/** Overwrite */
- (void)glkView:(nonnull GLKView *)view drawInRect:(CGRect)rect {
  [super glkView:view drawInRect:rect];
  
  if (_didCallOnMapReady) return;
  _didCallOnMapReady = true;
  if (self.onMapReady) self.onMapReady(@{});
}

#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (NSArray<id<RCTComponent>> *)reactSubviews {
  return _reactSubviews;
}
#pragma clang diagnostic pop

@end
