#import <React/RCTBridgeModule.h>
#import <OpenBiddingHelper/OpenBiddingHelper.h>

@interface RCT_EXTERN_MODULE(BidmadPluginCommon, NSObject)

_RCT_EXTERN_REMAP_METHOD(initializeSdk, initializeSdkWithAppKey:(NSString *)appKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(reqAdTrackingAuthorization, reqAdTrackingAuthorizationWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)

@end
