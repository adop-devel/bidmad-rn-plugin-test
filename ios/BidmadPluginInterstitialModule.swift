import Foundation
import OpenBiddingHelper

@objcMembers
@objc(BidmadPluginInterstitialModule)
class BidmadPluginInterstitialModule: RCTEventEmitter, BIDMADOpenBiddingInterstitialDelegate {

    private static var eventName = "AdEvents"
    private static let syncQueue: DispatchQueue = DispatchQueue(label: "com.adop.BidmadPluginInterstitial")
    private static var instances: [String: OpenBiddingInterstitial] = [:]
    
    override func supportedEvents() -> [String]! {
        return [Self.eventName]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override static func moduleName() -> String! {
        return "BidmadPluginInterstitialModule"
    }

    func createInstance(iOSZoneId: String, androidZoneId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let instanceId = UUID().uuidString
        Self.instances[instanceId] = OpenBiddingInterstitial(zoneID: iOSZoneId)
        Self.instances[instanceId]?.delegate = self
        resolve(instanceId)
    }
    
    func load(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.requestView()
        resolve(nil)
    }
    
    func show(instanceId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let topViewController = BIDMADUtil.topMostController() else {
                resolve(nil)
                return
            }
            
            Self.instances[instanceId]?.showView(on: topViewController)
            resolve(nil)
        }
    }

    func disposeInstance(instanceId: String) {
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
                    "action": "onInterstitialLoad",
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
                    "action": "onInterstitialLoadFail",
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
                    "action": "onInterstitialShow",
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
                    "action": "onInterstitialClick",
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
                    "action": "onInterstitialClose",
                  ])
    }
}
