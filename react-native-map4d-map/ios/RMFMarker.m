//
//  RMFMarker.m
//  Map4dMap
//
//  Created by Huy Dang on 4/28/20.
//  Copyright © 2020 IOTLink. All rights reserved.
//

#import "RMFMarker.h"
#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTImageView.h>
#import <Map4dMap/Map4dMap.h>
#import "RMFEventResponse.h"
#import "RMFDummyView.h"

@implementation RMFMarker {
//  RCTImageLoaderCancellationBlock _reloadImageCancellationBlock;
    UIView *_iconView;
    NSMutableArray* observables;
}

- (instancetype)init {
  if ((self = [super init])) {
    _map4dMarker = [[RMFMarkerMap4d alloc] init];
    _map4dMarker.reactMarker = self;
    
    _coordinate = _map4dMarker.position;
    _anchor = _map4dMarker.groundAnchor;
    _elevation = _map4dMarker.elevation;
    _rotation = _map4dMarker.rotation;
    _draggable = _map4dMarker.draggable;
    _infoWindowAnchor = _map4dMarker.infoWindowAnchor;
    _title = nil;//_map4dMarker.title;
    _snippet = nil;//_map4dMarker.snippet;
    _icon = nil;
    _zIndex = _map4dMarker.zIndex;
    _visible = true;//!_map4dMarker.isHidden;
    _userData = nil;
      _iconView = nil;
      observables = [[NSMutableArray alloc] init];
  }
  return self;
}

- (void)setMapView:(RMFMapView *)mapView {
  if (mapView != nil) {
    if (self.icon == nil) {
      _map4dMarker.icon = nil;
    } else {
      _map4dMarker.icon = [UIImage imageWithCGImage:self.icon.image.CGImage scale:[UIScreen mainScreen].scale orientation:self.icon.image.imageOrientation];
    }
  }
  _map4dMarker.map = mapView;
}

/** Property */

- (void)setCoordinate:(CLLocationCoordinate2D)coordinate {
  _coordinate = coordinate;
  _map4dMarker.position = coordinate;
}

- (void)setAnchor:(CGPoint)anchor {
  _anchor = anchor;
  _map4dMarker.groundAnchor = anchor;
}

- (void)setElevation:(double)elevation {
  _elevation = elevation;
  _map4dMarker.elevation = elevation;
}

- (void)setRotation:(double)rotation {
  _rotation = rotation;
  _map4dMarker.rotation = rotation;
}

- (void)setDraggable:(BOOL)draggable {
  _draggable = draggable;
  _map4dMarker.draggable = draggable;
}

- (void) setInfoWindowAnchor:(CGPoint)infoWindowAnchor {
  _infoWindowAnchor = infoWindowAnchor;
  _map4dMarker.infoWindowAnchor = infoWindowAnchor;
}

- (void)setTitle:(NSString *)title {
  _title = title;
  _map4dMarker.title = title;
}

- (void)setSnippet:(NSString *)snippet {
  _snippet = snippet;
  _map4dMarker.snippet = snippet;
}

- (void)setIcon:(RMFIcon *)icon {
  _icon = icon;
  if (icon == nil) {
    _map4dMarker.icon = nil;
    return;
  }
  dispatch_async(dispatch_get_global_queue(0,0), ^{
    NSData * imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: icon.uri]];
    if (imageData != nil) {
      dispatch_async(dispatch_get_main_queue(), ^{
        self->_icon.image = [UIImage imageWithData:imageData];
        if (self->_map4dMarker.map != nil) {
          CGFloat scale = [UIScreen mainScreen].scale;
          self->_map4dMarker.icon = [UIImage imageWithCGImage:[self->_icon.image CGImage] scale:scale orientation:self->_icon.image.imageOrientation];
        }
      });
    }
  });
}

- (void)setZIndex:(float)zIndex {
  _zIndex = zIndex;
  _map4dMarker.zIndex = zIndex;
}

- (void)setVisible:(BOOL)visible {
  _visible = visible;
  _map4dMarker.isHidden = !visible;
}

- (void)setUserInteractionEnabled:(BOOL)enabled {
  [super setUserInteractionEnabled:enabled];
  _map4dMarker.userInteractionEnabled = enabled;
}

 - (void)setUserData:(NSDictionary *)userData {
   _userData = userData;
//   _map4dMarker.userData = userData;
 }

/** Event */
- (void)didBeginDraggingMarker {
  if (!self.onDragStart) return;
  self.onDragStart([RMFEventResponse eventFromMarker:self action:@"marker-drag-start"]);
}

- (void)didEndDraggingMarker {
  if (!self.onDragEnd) return;
  self.onDragEnd([RMFEventResponse eventFromMarker:self action:@"marker-drag-end"]);
}

- (void)didDragMarker {
  if (!self.onDrag) return;
  self.onDrag([RMFEventResponse eventFromMarker:self action:@"marker-drag"]);
}

- (void)didTapInfoWindowOfMarker {
  if (!self.onPressInfoWindow) return;
  self.onPressInfoWindow([RMFEventResponse eventFromMarker:self action:@"marker-info-window-press"]);
}

- (void)didTapMarker {
  if (!self.onPress) return;
  self.onPress([RMFEventResponse eventFromMarker:self action:@"marker-press"]);
}

- (void)layoutSubviews {
    [super layoutSubviews];
  float width = 0;
  float height = 0;

  for (UIView *v in [_iconView subviews]) {
    float fw = v.frame.origin.x + v.frame.size.width;
    float fh = v.frame.origin.y + v.frame.size.height;

    width = MAX(fw, width);
    height = MAX(fh, height);
  }
  [_iconView setFrame:CGRectMake(0, 0, width, height)];
  [self->_map4dMarker setIconView:_iconView];
}

- (void)iconViewInsertSubview:(UIView*)subview atIndex:(NSInteger)atIndex {
  if (!_map4dMarker.iconView) {
    _iconView = [[UIView alloc] init];
    _map4dMarker.iconView = _iconView;
  }
  [_iconView insertSubview:subview atIndex:atIndex];
}

- (void) removeAllObserver {
    for (UIView* v in observables) {
        [v removeObserver:self forKeyPath:@"image"];
        [v removeObserver:self forKeyPath:@"bounds"];
    }
    [observables removeAllObjects];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    UIApplicationState appState = [[UIApplication sharedApplication] applicationState];
    if (context == (__bridge void * _Nullable)(_iconView)) {
        if (_map4dMarker != NULL) {
            //TODO: remove me
            //RCTImageView will clear image when window == nil or app go to background mode --> causes a bug, marker is updated without image.
            //TODO: how to fix if we stop cheating?
            if (context == (__bridge void * _Nullable) self.map4dMarker.iconView
                && (!self.window || appState == UIApplicationStateBackground)
                ) {
                return;
            }
            [self.map4dMarker setIconView:_iconView];
        }
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

- (void)addObserver:(UIView*)view {
  if ([view isKindOfClass:[RCTImageView class]]) {
    [view addObserver:self forKeyPath:@"image" options:NSKeyValueObservingOptionNew context:(__bridge void * _Nullable)(_iconView)];
    [view addObserver:self forKeyPath:@"bounds" options:NSKeyValueObservingOptionNew context:(__bridge void * _Nullable)(_iconView)];
      [observables addObject:view];
  }
  
  NSArray<UIView *> *reactSubviews = [view reactSubviews];
  for (int i = 0; i < reactSubviews.count; i++) {
    UIView* view = [reactSubviews objectAtIndex:i];
    [self addObserver:view];
  }
}


- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
  [self iconViewInsertSubview:(UIView*)subview atIndex:atIndex+1];
    [self removeAllObserver];
    [self addObserver:(UIView *) subview];
  RMFDummyView *dummySubview = [[RMFDummyView alloc] initWithView:(UIView *)subview];
  [super insertReactSubview:(UIView*)dummySubview atIndex:atIndex];
}

- (void)removeReactSubview:(id<RCTComponent>)dummySubview {
    [self removeAllObserver];
  UIView* subview = ((RMFDummyView*)dummySubview).view;
  [(UIView*)subview removeFromSuperview];
  [super removeReactSubview:(UIView*)dummySubview];
}

- (void)dealloc
{
    [self removeAllObserver];
}

@end
