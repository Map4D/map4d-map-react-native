//
//  RMFPolyline.h
//  Map4dMap
//
//  Created by Huy Dang on 7/3/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#ifndef RMFPolyline_h
#define RMFPolyline_h

#import <React/UIView+React.h>
#import <Map4dMap/Map4dMap.h>
#import <RMFPolylineMap4d.h>
#import <RMFMapView.h>
#import <MFCoordinate.h>

@interface RMFPolyline : UIView

@property (nonatomic, strong) RMFPolylineMap4d * map4dPolyline;

@property (nonatomic, copy) RCTBubblingEventBlock _Nullable onPress;

//@property(nonatomic, strong, nullable) MFPath *path;
@property(nonatomic, strong) NSArray<MFCoordinate *> * coordinates;
@property(nonatomic, assign) CGFloat width;
@property(nonatomic, assign) NSString * lineStyle;
@property(nonatomic, assign, nullable) UIColor * color;

- (void)didTap;
- (void)setMapView:(RMFMapView* _Nullable)mapView;

@end


#endif /* RMFPolyline_h */