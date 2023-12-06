//
//  BidmadCommon.swift
//  react-native-bidmad-plugin-test
//
//  Created by 플랫폼-오승섭-맥북 on 2023/11/30.

//

import Foundation
import OpenBiddingHelper

@objcMembers
@objc(BidmadPluginCommonModule)
class BidmadPluginCommonModule: NSObject, RCTBridgeModule {
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    static func moduleName() -> String! {
        return "BidmadPluginCommonModule"
    }
    
    func initializeSdk(appKey: String,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
        BidmadCommon.initializeSdk(withAppKey: appKey) { success in
            if success {
                resolve(true)
            } else {
                reject("E_INIT_FAILED", "Initialization failed", nil)
            }
        }
    }
    
    func reqAdTrackingAuthorization(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        BidmadCommon.reqAdTrackingAuthorization { status in
            resolve(status.rawValue)
        }
    }
    
    func setAdvertiserTracking(enable: Bool, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        BidmadCommon.setAdvertiserTrackingEnabled(enable)
        resolve(nil);
    }
    
    func getAdvertiserTracking(resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(BidmadCommon.getAdvertiserTrackingEnabled())
    }
    
    func set(isChildDirectedAds: Bool, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        BidmadCommon.setIsChildDirectedAds(isChildDirectedAds)
        resolve(nil);
    }
    
    func isChildDirectedTreatment(resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        guard let isChildDirectedAds = BidmadCommon.isChildDirectedTreatment() else {
            resolve(nil)
            return
        }
        
        resolve(isChildDirectedAds.boolValue)
    }
    
    func set(userConsentStatusForCCPACompliance: Bool, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        BidmadCommon.setUserConsentStatusForCCPACompliance(userConsentStatusForCCPACompliance)
        resolve(nil)
    }
    
    func isUserConsentCCPA(resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        guard let isUserConsentCCPA = BidmadCommon.isUserConsentCCPA() else {
            resolve(nil)
            return
        }
        
        resolve(isUserConsentCCPA.boolValue)
    }
    
    func set(isDebug: Bool, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        BidmadCommon.setIsDebug(isDebug)
        resolve(nil)
    }
    
    func isDebug(resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(BidmadCommon.isDebug())
    }
    
    func set(testDeviceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        BidmadCommon.setTestDeviceId(testDeviceId)
        resolve(nil)
    }
    
    func testDeviceId(resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(BidmadCommon.testDeviceId())
    }

    func set(cuid: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        BidmadCommon.setCuid(cuid)
        resolve(nil)
    }
    
    func cuid(resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(BidmadCommon.cuid())
    }
    
    func set(useServerSideCallback: Bool, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        BidmadCommon.setUseServerSideCallback(useServerSideCallback)
        resolve(nil)
    }
    
    func useServerSideCallback(resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(BidmadCommon.useServerSideCallback())
    }
}
