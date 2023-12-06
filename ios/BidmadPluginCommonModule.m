_Pragma("clang diagnostic push")
_Pragma("clang diagnostic ignored \"-Wstrict-prototypes\"")

#import <React/RCTBridgeModule.h>
#import <OpenBiddingHelper/OpenBiddingHelper.h>

@interface RCT_EXTERN_MODULE(BidmadPluginCommonModule, NSObject)

_RCT_EXTERN_REMAP_METHOD(initializeSdk, initializeSdkWithAppKey:(NSString *)appKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(reqAdTrackingAuthorization, reqAdTrackingAuthorizationWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setAdvertiserTracking, setAdvertiserTrackingWithEnable:(BOOL)enable, false)
_RCT_EXTERN_REMAP_METHOD(advertiserTracking, getAdvertiserTrackingWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setIsChildDirectedAds, setWithIsChildDirectedAds:(BOOL)isChildDirectedAds, false)
_RCT_EXTERN_REMAP_METHOD(isChildDirectedTreatment, isChildDirectedTreatmentWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setUserConsentCCPA, setWithUserConsentStatusForCCPACompliance:(BOOL)userConsentStatusForCCPACompliance, false)
_RCT_EXTERN_REMAP_METHOD(isUserConsentCCPA, isUserConsentCCPAWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setIsDebug, setWithIsDebug:(BOOL)isDebug, false)
_RCT_EXTERN_REMAP_METHOD(isDebug, isDebugWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setTestDeviceId, setWithTestDeviceId:(NSString *)testDeviceId, false)
_RCT_EXTERN_REMAP_METHOD(testDeviceId, testDeviceIdWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setCuid, setWithCuid:(NSString *)cuid, false)
_RCT_EXTERN_REMAP_METHOD(cuid, cuidWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setUseServerSideCallback, setWithUseServerSideCallback:(BOOL)useServerSideCallback, false)
_RCT_EXTERN_REMAP_METHOD(useServerSideCallback, useServerSideCallbackWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)

@end

_Pragma("clang diagnostic pop")
