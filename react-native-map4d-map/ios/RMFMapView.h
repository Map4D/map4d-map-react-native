//
//  RMFMapView.h
//  Map4dMap
//
//  Created by Huy Dang on 4/27/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#ifndef RMFMapView_h
#define RMFMapView_h

#import <UIKit/UIKit.h>
#import <Map4dMap/Map4dMap.h>
#import <React/RCTComponent.h>

@interface  RMFMapView : MFMapView

@property (nonatomic, copy) RCTBubblingEventBlock onMapReady;
//@property (nonatomic, copy) RCTBubblingEventBlock onMapLoaded;
//@property (nonatomic, copy) RCTBubblingEventBlock onKmlReady;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
//@property (nonatomic, copy) RCTBubblingEventBlock onLongPress;
//@property (nonatomic, copy) RCTBubblingEventBlock onPanDrag;
//@property (nonatomic, copy) RCTBubblingEventBlock onUserLocationChange;
//@property (nonatomic, copy) RCTBubblingEventBlock onMarkerPress;
//@property (nonatomic, copy) RCTBubblingEventBlock onChange;
@property (nonatomic, copy) RCTBubblingEventBlock onPoiPress;
@property (nonatomic, copy) RCTBubblingEventBlock onBuildingPress;
@property (nonatomic, copy) RCTBubblingEventBlock onPlacePress;
//@property (nonatomic, copy) RCTDirectEventBlock onRegionChange;
//@property (nonatomic, copy) RCTDirectEventBlock onRegionChangeComplete;
//@property (nonatomic, copy) RCTDirectEventBlock onIndoorLevelActivated;
//@property (nonatomic, copy) RCTDirectEventBlock onIndoorBuildingFocused;
@property (nonatomic, copy) RCTDirectEventBlock onCameraMove;
@property (nonatomic, copy) RCTDirectEventBlock onCameraMoveStart;
@property (nonatomic, copy) RCTDirectEventBlock onCameraIdle;
@property (nonatomic, copy) RCTDirectEventBlock onMyLocationButtonPress;
@property (nonatomic, copy) RCTDirectEventBlock onReachLimitedZoom;

//@property (nonatomic, assign) MKCoordinateRegion initialRegion;
//@property (nonatomic, assign) MKCoordinateRegion region;
@property (nonatomic, assign) MFCameraPosition *cameraProp;   // Because the base class already has a "camera" prop.
@property (nonatomic, assign) NSString* mapTypeProp;
//@property (nonatomic, assign) GMSCameraPosition *initialCamera;
//@property (nonatomic, assign) NSString *customMapStyleString;
//@property (nonatomic, assign) UIEdgeInsets mapPadding;
//@property (nonatomic, assign) NSString *paddingAdjustmentBehaviorString;

@property (nonatomic, assign) BOOL showsBuildings;
@property (nonatomic, assign) BOOL showsPOIs;
//@property (nonatomic, assign) BOOL showsTraffic;
//@property (nonatomic, assign) BOOL showsCompass;

@property (nonatomic, assign) BOOL zoomGesturesEnabled;
@property (nonatomic, assign) BOOL scrollGesturesEnabled;
@property (nonatomic, assign) BOOL rotateGesturesEnabled;
@property (nonatomic, assign) BOOL tiltGesturesEnabled;

@property (nonatomic, assign) BOOL showsMyLocation;
@property (nonatomic, assign) BOOL showsMyLocationButton;
//@property (nonatomic, assign) BOOL showsIndoors;
//@property (nonatomic, assign) BOOL showsIndoorLevelPicker;
//@property (nonatomic, assign) NSString *kmlSrc;

@property(nonatomic, readonly) CGPoint lastTapPixel;
@property(nonatomic, readonly) CGPoint lastPanPixel;
@property(nonatomic, readonly) CGPoint lastLongPressPixel;

- (void)willMove: (BOOL) gesture;
- (void)movingCameraPosition: (MFCameraPosition*) position;
- (void)didChangeCameraPosition: (MFCameraPosition*) position;
- (void)idleAtCameraPosition: (MFCameraPosition *) position;
- (void)onReachLimitedZoom: (double) zoom;

- (void)didTapAtCoordinate:(CLLocationCoordinate2D)coordinate;
- (void)didTapPOIWithPlaceID:(NSString *)placeID name:(NSString *)name location:(CLLocationCoordinate2D)location;
- (void)didTapBuildingWithBuildingID:(NSString *)buildingID name:(NSString *)name location:(CLLocationCoordinate2D)location;
- (void)didTapPlaceWithName:(NSString*)name location:(CLLocationCoordinate2D)location;
- (BOOL)didTapMyLocationButton;

@end

#endif /* RMFMapView_h */
