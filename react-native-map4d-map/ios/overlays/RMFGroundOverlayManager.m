//
//  RMFGroundOverlayManager.m
//  react-native-map4d-map
//
//  Created by Huy Dang on 12/16/21.
//

#import "RMFGroundOverlayManager.h"
#import "RMFGroundOverlay.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation RMFGroundOverlayManager

RCT_EXPORT_MODULE(RMFGroundOverlay)

- (UIView *)view {
  RMFGroundOverlay * overlay = [[RMFGroundOverlay alloc] init];
  return overlay;
}

RCT_EXPORT_VIEW_PROPERTY(urlTemplate, NSString)
RCT_REMAP_VIEW_PROPERTY(bounds, coordinateBounds, MFCoordinateBounds)
RCT_REMAP_VIEW_PROPERTY(override, overrideBaseMap, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zIndex, float)
RCT_EXPORT_VIEW_PROPERTY(visible, BOOL)

@end
