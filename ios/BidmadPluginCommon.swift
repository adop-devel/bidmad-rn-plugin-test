//
//  BidmadCommon.swift
//  react-native-bidmad-plugin-test
//
//  Created by 플랫폼-오승섭-맥북 on 2023/11/30.

//

import Foundation
import OpenBiddingHelper

@objcMembers
@objc(BidmadPluginCommon)
class BidmadPluginCommon: NSObject, RCTBridgeModule {
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    static func moduleName() -> String! {
        return "BidmadPluginCommon"
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
    
    func getAdvertiserTracking(resolver resolve: @escaping RCTPromiseResolveBlock) {
        resolve(BidmadCommon.getAdvertiserTrackingEnabled())
    }
    
    func set(isChildDirectedAds: Bool) {
        BidmadCommon.setIsChildDirectedAds(isChildDirectedAds)
    }
    
    func isChildDirectedTreatment(resolver resolve: @escaping RCTPromiseResolveBlock) {
        resolve(BidmadCommon.isChildDirectedTreatment())
    }
    
    func set(userConsentStatusForCCPACompliance: Bool) {
        BidmadCommon.setUserConsentStatusForCCPACompliance(userConsentStatusForCCPACompliance)
    }
    
    func isUserConsentCCPA(resolver resolve: @escaping RCTPromiseResolveBlock) {
        resolve(BidmadCommon.isUserConsentCCPA())
    }
    
    func set(isDebug: Bool) {
        BidmadCommon.setIsDebug(isDebug)
    }
    
    func isDebug(resolver resolve: @escaping RCTPromiseResolveBlock) {
        resolve(BidmadCommon.isDebug())
    }
    
    func set(testDeviceId: String) {
        BidmadCommon.setTestDeviceId(testDeviceId)
    }
    
    func testDeviceId(resolver resolve: @escaping RCTPromiseResolveBlock) {
        resolve(BidmadCommon.testDeviceId())
    }

    func set(cuid: String) {
        BidmadCommon.setCuid(cuid)
    }
    
    func cuid(resolver resolve: @escaping RCTPromiseResolveBlock) {
        resolve(BidmadCommon.cuid())
    }
    
    func set(useServerSideCallback: Bool) {
        BidmadCommon.setUseServerSideCallback(useServerSideCallback)
    }
    
    func useServerSideCallback(resolver resolve: @escaping RCTPromiseResolveBlock) {
        resolve(BidmadCommon.useServerSideCallback())
    }
}
