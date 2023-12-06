_Pragma("clang diagnostic push")
_Pragma("clang diagnostic ignored \"-Wstrict-prototypes\"")

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(BidmadPluginInterstitialModule, RCTEventEmitter)

_RCT_EXTERN_REMAP_METHOD(createInstance, createInstanceWithZoneId:(NSString *)zoneId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(load, loadWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(show, showWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(isLoaded, isLoadedWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(disposeInstance, disposeInstanceWithInstanceId:(NSString *)instanceId, false)

@end

_Pragma("clang diagnostic pop")
