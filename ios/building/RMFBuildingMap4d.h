//
//  RMFBuildingMap4d.h
//  react-native-map4d-map
//
//  Created by Huy Dang on 6/10/25.
//  Copyright © 2025 IOTLink. All rights reserved.
//

#ifndef RMFBuildingMap4d_h
#define RMFBuildingMap4d_h

#import <Map4dMap/Map4dMap.h>

@class RMFBuilding;

@interface RMFBuildingMap4d : MFBuilding

@property (nonatomic, weak) RMFBuilding *reactBuilding;

@end


#endif /* RMFBuildingMap4d_h */
