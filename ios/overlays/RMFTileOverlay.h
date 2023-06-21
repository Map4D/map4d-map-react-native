//
//  RMFTileOverlay.h
//  react-native-map4d-map
//
//  Created by Huy Dang on 12/15/21.
//

#ifndef RMFTileOverlay_h
#define RMFTileOverlay_h

#import <React/UIView+React.h>
#import <Map4dMap/Map4dMap.h>
#import "RMFMapView.h"

@class RMFTileOverlay;

@interface RMFTileURLConstructor : NSObject<MFTileURLConstructor>
@property(nonatomic, weak, nullable) RMFTileOverlay *reactTileOverlay;
@end

#pragma mark - RMFTileOverlay

@interface RMFTileOverlay : UIView

@property(nonatomic, strong, nullable) MFURLTileLayer* urlTileLayer;

@property(nonatomic, strong, nullable) NSString *urlTemplate;
@property(nonatomic, assign) float zIndex;
@property(nonatomic, assign) BOOL visible;

- (void)setMapView:(RMFMapView* _Nullable)mapView;

@end


#endif /* RMFTileOverlay_h */
