#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(BidmadPluginTestViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(iOSZoneId, NSString)
RCT_EXPORT_VIEW_PROPERTY(androidZoneId, NSString)
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadFail, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onClick, RCTDirectEventBlock)

@end
