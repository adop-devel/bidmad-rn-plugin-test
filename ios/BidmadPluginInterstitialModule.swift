import Foundation
import OpenBiddingHelper

@objcMembers
@objc(BidmadPluginInterstitialModule)
class BidmadPluginInterstitialModule: RCTEventEmitter, BIDMADOpenBiddingInterstitialDelegate {

    private static let eventName = "BidmadInterstitialCallback"
    private static var instances: [String: (current: OpenBiddingInterstitial, future: OpenBiddingInterstitial?)] = [:]
    
    override func supportedEvents() -> [String]! {
        return [Self.eventName]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override static func moduleName() -> String! {
        return "BidmadPluginInterstitialModule"
    }

    func createInstance(zoneId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        let instanceId = UUID().uuidString
        Self.instances[instanceId] = (OpenBiddingInterstitial(zoneID: zoneId), nil)
        Self.instances[instanceId]!.current.delegate = self
        resolve(instanceId)
    }
    
    func load(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.current.requestView()
        resolve(nil)
    }
    
    func show(instanceId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let topViewController = BIDMADUtil.topMostController() else {
                resolve(nil)
                return
            }
            
            Self.instances[instanceId]?.current.showView(on: topViewController)
            resolve(nil)
        }
    }

    func isLoaded(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        let loadStatus = Self.instances[instanceId]?.current.isLoaded;
        resolve(loadStatus);
    }

    func disposeInstance(instanceId: String) {
        Self.instances.removeValue(forKey: instanceId)
    }
    
    func onLoadAd(_ bidmadAd: OpenBiddingInterstitial) {
        guard let instanceId = Self.instances
            .filter({ $0.value.current.isEqual(bidmadAd) || $0.value.future?.isEqual(bidmadAd) ?? false })
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
            .filter({ $0.value.current.isEqual(bidmadAd) })
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
            .filter({ $0.value.current.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        preloadAd(instanceId: instanceId)
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onInterstitialShow",
                  ])
    }
    
    func onClickAd(_ bidmadAd: OpenBiddingInterstitial) {
        guard let instanceId = Self.instances
            .filter({ $0.value.current.isEqual(bidmadAd) })
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
            .filter({ $0.value.current.isEqual(bidmadAd) })
            .first?
            .key else {
            return
        }
        
        Self.instances[instanceId] = (Self.instances[instanceId]!.future!, nil)
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onInterstitialClose",
                  ])
    }
    
    func preloadAd(instanceId: String) {
        let futureAd = OpenBiddingInterstitial(zoneID: Self.instances[instanceId]!.current.zoneID)
        futureAd.delegate = self
        
        Self.instances[instanceId] = (Self.instances[instanceId]!.current, futureAd)
        Self.instances[instanceId]?.future?.requestView()
    }
}
