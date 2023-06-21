#import <UIKit/UIKit.h>


@interface RMFDummyView : UIView
@property (nonatomic, weak) UIView *view;
- (instancetype)initWithView:(UIView*)view;
@end