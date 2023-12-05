import Foundation
import OpenBiddingHelper

@objcMembers
@objc(BidmadPluginInterstitial)
class BidmadPluginInterstitial: RCTEventEmitter, BIDMADOpenBiddingInterstitialDelegate {

    private static var eventName = "AdEvents"
    private static var instanceCounter: Int = 0
    private static let syncQueue: DispatchQueue = DispatchQueue(label: "com.adop.BidmadPluginInterstitial")
    private static var instances: [Int: OpenBiddingInterstitial] = [:]
    
    override func supportedEvents() -> [String]! {
        return [Self.eventName]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override static func moduleName() -> String! {
        return "BidmadPluginInterstitial"
    }

    func createInstance(iOSZoneId: String, androidZoneId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        Self.syncQueue.async {
            Self.instanceCounter += 1
            let instanceId = Self.instanceCounter
            Self.instances[instanceId] = OpenBiddingInterstitial(zoneID: iOSZoneId)
            resolve(instanceId)
        }
    }
    
    func load(instanceId: Int, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.requestView()
        resolve(nil)
    }
    
    func show(instanceId: Int, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        guard let topViewController = BIDMADUtil.topMostController() else {
            resolve(nil)
            return
        }
        
        Self.instances[instanceId]?.showView(on: topViewController)
        resolve(nil)
    }

    func disposeInstance(instanceId: Int) {
        Self.instances.removeValue(forKey: instanceId)
    }
    
    func onLoadAd(_ bidmadAd: OpenBiddingInterstitial) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName, 
                  body: [
                    "instanceId": instanceId,
                    "action": "onLoad",
                  ])
    }
    
    func onLoadFailAd(_ bidmadAd: OpenBiddingInterstitial, error: Error) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onLoadFail",
                    "error": error.localizedDescription,
                  ])
    }
    
    func onShowAd(_ bidmadAd: OpenBiddingInterstitial) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onShow",
                  ])
    }
    
    func onClickAd(_ bidmadAd: OpenBiddingInterstitial) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onClick",
                  ])
    }
    
    func onCloseAd(_ bidmadAd: OpenBiddingInterstitial) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onClose",
                  ])
    }
}
