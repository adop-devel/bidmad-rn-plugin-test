import Foundation
import OpenBiddingHelper

@objcMembers
@objc(BidmadPluginRewardModule)
class BidmadPluginRewardModule: RCTEventEmitter, BIDMADOpenBiddingRewardVideoDelegate {

    private static var eventName = "AdEvents"
    private static let syncQueue: DispatchQueue = DispatchQueue(label: "com.adop.BidmadPluginReward")
    private static var instances: [String: OpenBiddingRewardVideo] = [:]
    
    override func supportedEvents() -> [String]! {
        return [Self.eventName]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override static func moduleName() -> String! {
        return "BidmadPluginRewardModule"
    }

    func createInstance(zoneId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let instanceId = UUID().uuidString
        Self.instances[instanceId] = OpenBiddingRewardVideo(zoneID: zoneId)
        Self.instances[instanceId]?.delegate = self
        resolve(instanceId)
    }
    
    func load(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.request()
        resolve(nil)
    }
    
    func show(instanceId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let topViewController = BIDMADUtil.topMostController() else {
                resolve(nil)
                return
            }
            
            Self.instances[instanceId]?.show(on: topViewController)
            resolve(nil)
        }
    }

    func isLoaded(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        let loadStatus = Self.instances[instanceId]?.isLoaded;
        resolve(loadStatus);
    }

    func disposeInstance(instanceId: String) {
        Self.instances.removeValue(forKey: instanceId)
    }
    
    func onLoadAd(_ bidmadAd: OpenBiddingRewardVideo) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName, 
                  body: [
                    "instanceId": instanceId,
                    "action": "onRewardLoad",
                  ])
    }
    
    func onLoadFailAd(_ bidmadAd: OpenBiddingRewardVideo, error: Error) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onRewardLoadFail",
                    "error": error.localizedDescription,
                  ])
    }
    
    func onShowAd(_ bidmadAd: OpenBiddingRewardVideo) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onRewardShow",
                  ])
    }
    
    func onCompleteAd(_ bidmadAd: OpenBiddingRewardVideo) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onRewardComplete",
                  ])
    }
    
    func onClickAd(_ bidmadAd: OpenBiddingRewardVideo) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onRewardClick",
                  ])
    }
    
    func onCloseAd(_ bidmadAd: OpenBiddingRewardVideo) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onRewardClose",
                  ])
    }
}
