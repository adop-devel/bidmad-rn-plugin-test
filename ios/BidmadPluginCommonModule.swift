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
    
    func setAdvertiserTracking(enable: Bool) {
        BidmadCommon.setAdvertiserTrackingEnabled(enable)
    }
    
    func getAdvertiserTracking(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(BidmadCommon.getAdvertiserTrackingEnabled())
    }
    
    func set(isChildDirectedAds: Bool) {
        BidmadCommon.setIsChildDirectedAds(isChildDirectedAds)
    }
    
    func isChildDirectedTreatment(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let isChildDirectedAds = BidmadCommon.isChildDirectedTreatment() else {
            resolve(nil)
            return
        }
        
        resolve(isChildDirectedAds.boolValue)
    }
    
    func set(userConsentStatusForCCPACompliance: Bool) {
        BidmadCommon.setUserConsentStatusForCCPACompliance(userConsentStatusForCCPACompliance)
    }
    
    func isUserConsentCCPA(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let isUserConsentCCPA = BidmadCommon.isUserConsentCCPA() else {
            resolve(nil)
            return
        }
        
        resolve(isUserConsentCCPA.boolValue)
    }
    
    func set(isDebug: Bool) {
        BidmadCommon.setIsDebug(isDebug)
    }
    
    func isDebug(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(BidmadCommon.isDebug())
    }
    
    func set(testDeviceId: String) {
        BidmadCommon.setTestDeviceId(testDeviceId)
    }
    
    func testDeviceId(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(BidmadCommon.testDeviceId())
    }

    func set(cuid: String) {
        BidmadCommon.setCuid(cuid)
    }
    
    func cuid(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(BidmadCommon.cuid())
    }
    
    func set(useServerSideCallback: Bool) {
        BidmadCommon.setUseServerSideCallback(useServerSideCallback)
    }
    
    func useServerSideCallback(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(BidmadCommon.useServerSideCallback())
    }
}
