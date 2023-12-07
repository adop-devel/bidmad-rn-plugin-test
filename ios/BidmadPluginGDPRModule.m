_Pragma("clang diagnostic push")
_Pragma("clang diagnostic ignored \"-Wstrict-prototypes\"")

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(BidmadPluginGDPRModule, RCTEventEmitter)

_RCT_EXTERN_REMAP_METHOD(createInstance, createInstanceWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject, false)
_RCT_EXTERN_REMAP_METHOD(setDebug,
    setDebugWithInstanceId:(NSString *)instanceId testDeviceId:(NSString *)testDeviceId isEEA:(BOOL)isEEA resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject,
    false)
_RCT_EXTERN_REMAP_METHOD(requestConsentInfoUpdate,
    requestConsentInfoUpdateWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject,
    false)
_RCT_EXTERN_REMAP_METHOD(isConsentFormAvailable,
    isConsentFormAvailableWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject,
    false)
_RCT_EXTERN_REMAP_METHOD(loadForm,
    loadFormWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject,
    false)
_RCT_EXTERN_REMAP_METHOD(getConsentStatus,
    getConsentStatusWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject,
    false)
_RCT_EXTERN_REMAP_METHOD(reset,
    resetWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject,
    false)
_RCT_EXTERN_REMAP_METHOD(showForm,
    showFormWithInstanceId:(NSString *)instanceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject,
    false)

@end

_Pragma("clang diagnostic pop")
