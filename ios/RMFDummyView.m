
#import <Foundation/Foundation.h>
#import "RMFDummyView.h"

@implementation RMFDummyView
- (instancetype)initWithView:(UIView*)view
{
  if ((self = [super init])) {
    self.view = view;
  }
  return self;
}
@end