//
//  RMFGroundOverlay.h
//  react-native-map4d-map
//
//  Created by Huy Dang on 12/16/21.
//

#ifndef RMFGroundOverlay_h
#define RMFGroundOverlay_h

#import <React/UIView+React.h>
#import <Map4dMap/Map4dMap.h>
#import "RMFMapView.h"

@interface RMFGroundOverlay : UIView

@property(nonatomic, strong, nullable) NSString *urlTemplate;
@property(nonatomic, strong, nullable) MFCoordinateBounds* coordinateBounds;
@property(nonatomic, assign) BOOL overrideBaseMap;
@property(nonatomic, assign) float zIndex;
@property(nonatomic, assign) BOOL visible;

- (void)setMapView:(RMFMapView* _Nullable)mapView;

@end

#endif /* RMFGroundOverlay_h */
