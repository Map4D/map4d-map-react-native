//
//  RMFDirectionsRendererMap4d.h
//  Map4dMap React Native
//
//  Created by Huy Dang on 11/15/21.
//

#ifndef RMFDirectionsRendererMap4d_h
#define RMFDirectionsRendererMap4d_h

#import <Map4dMap/Map4dMap.h>

@class RMFDirectionsRenderer;

@interface RMFDirectionsRendererMap4d : MFDirectionsRenderer

@property (nonatomic, weak) RMFDirectionsRenderer* reactRenderer;

@end

#endif /* RMFDirectionsRendererMap4d_h */
