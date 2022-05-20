//
//  RMFCircleManager.m
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFCircleManager.h"
#import "RMFCircle.h"
#import <Foundation/Foundation.h>
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation RMFCircleManager

RCT_EXPORT_MODULE(RMFCircle)

- (UIView *)view {
  RMFCircle * circle = [[RMFCircle alloc] init];
  return circle;
}

RCT_REMAP_VIEW_PROPERTY(center, centerCoordinate, CLLocationCoordinate2D)
RCT_EXPORT_VIEW_PROPERTY(radius, double)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, double)
RCT_EXPORT_VIEW_PROPERTY(userInteractionEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zIndex, float)
RCT_EXPORT_VIEW_PROPERTY(visible, BOOL)
RCT_EXPORT_VIEW_PROPERTY(userData, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(setCenter:(nonnull NSNumber *)reactTag
                  withCoordinate:(id)coordinate)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      [circle setCenterCoordinate:[RCTConvert CLLocationCoordinate2D:coordinate]];
    }
  }];
}

RCT_EXPORT_METHOD(setRadius:(nonnull NSNumber *)reactTag
                  withRadius:(double)radius)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      [circle setRadius:radius];
    }
  }];
}

RCT_EXPORT_METHOD(setFillColor:(nonnull NSNumber *)reactTag
                  color:(id)color)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      UIColor* fillCorlor = [RCTConvert UIColor:color];
      if (fillCorlor != nil) {
        [circle setFillColor:fillCorlor];
      }
    }
  }];
}

RCT_EXPORT_METHOD(setStrokeColor:(nonnull NSNumber *)reactTag
                  color:(id)color)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      UIColor* strokeColor = [RCTConvert UIColor:color];
      if (strokeColor != nil) {
        [circle setStrokeColor:strokeColor];
      }
    }
  }];
}

RCT_EXPORT_METHOD(setStrokeWidth:(nonnull NSNumber *)reactTag
                  width:(double)width)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      [circle setStrokeWidth:width];
    }
  }];
}

RCT_EXPORT_METHOD(setZIndex:(nonnull NSNumber *)reactTag
                  zIndex:(float)zIndex)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      [circle setZIndex:zIndex];
    }
  }];
}

RCT_EXPORT_METHOD(setVisible:(nonnull NSNumber *)reactTag
                  visible:(BOOL)visible)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      [circle setVisible:visible];
    }
  }];
}

RCT_EXPORT_METHOD(setUserData:(nonnull NSNumber *)reactTag
                  userData:(id)json)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RMFCircle class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RMFCircle, got: %@", view);
    } else {
      RMFCircle *circle = (RMFCircle *)view;
      [circle setUserData:[RCTConvert NSDictionary:json]];
    }
  }];
}

@end
