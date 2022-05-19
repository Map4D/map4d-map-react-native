//
//  RMFTileOverlayManager.m
//  react-native-map4d-map
//
//  Created by Huy Dang on 12/15/21.
//

#import "RMFTileOverlayManager.h"
#import "RMFTileOverlay.h"
#import <React/RCTConvert+CoreLocation.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation RMFTileOverlayManager

RCT_EXPORT_MODULE(RMFTileOverlay)

- (UIView *)view {
  RMFTileOverlay * overlay = [[RMFTileOverlay alloc] init];
  return overlay;
}

RCT_EXPORT_VIEW_PROPERTY(urlTemplate, NSString)
RCT_EXPORT_VIEW_PROPERTY(zIndex, float)
RCT_EXPORT_VIEW_PROPERTY(visible, BOOL)

@end
