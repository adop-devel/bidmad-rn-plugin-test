import Foundation
import BidmadSDK

@objcMembers
@objc(BidmadPluginGDPRModule)
class BidmadPluginGDPRModule: RCTEventEmitter, BIDMADGDPRforGoogleProtocolIdentifiable {
    private static let eventName = "BidmadGDPRCallback"
    private static var instances: [String: BIDMADGDPRforGoogle] = [:]
    static var shared: BidmadPluginGDPRModule?

    override func supportedEvents() -> [String]! {
        return [Self.eventName];
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override static func moduleName() -> String! {
        return "BidmadPluginGDPRModule"
    }

    func createInstance(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let instanceId = UUID().uuidString;
            Self.instances[instanceId] = BIDMADGDPRforGoogle(UIViewController())
            Self.instances[instanceId]!.consentStatusDelegate = Self.instances[instanceId]!
            resolve(instanceId)
        }
    }
    
    func setDebug(instanceId: String, testDeviceId: String, isEEA: Bool, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.setDebug(testDeviceId, isTestEurope: isEEA)
        resolve(nil)
    }
    
    func requestConsentInfoUpdate(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.requestConsentInfoUpdate()
        resolve(nil)
    }
    
    func isConsentFormAvailable(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        let status = Self.instances[instanceId]?.isConsentFormAvailable()
        resolve(status)
    }
    
    func loadForm(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.loadForm()
        resolve(nil)
    }
    
    func getConsentStatus(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        let consentStatus = Self.instances[instanceId]?.getConsentStatus()
        resolve(consentStatus)
    }
    
    func reset(instanceId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Self.instances[instanceId]?.reset()
        resolve(nil)
    }
    
    func showForm(instanceId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            Self.instances[instanceId]?.parentViewController = BIDMADUtil.topMostController() ?? .init()
            Self.instances[instanceId]?.showForm()
            resolve(nil)
        }
    }

    func onConsentInfoUpdateSuccess(_ instance: BIDMADGDPRforGoogle) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(instance) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onConsentInfoUpdateSuccess",
                  ])
    }
    
    func onConsentInfoUpdateFailure(_ formError: Error, _ instance: BIDMADGDPRforGoogle) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(instance) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onConsentInfoUpdateFailure",
                    "error": formError.localizedDescription
                  ])
    }
    
    func onConsentFormLoadSuccess(_ instance: BIDMADGDPRforGoogle) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(instance) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onConsentFormLoadSuccess"
                  ])
    }
    
    func onConsentFormLoadFailure(_ formError: Error, _ instance: BIDMADGDPRforGoogle) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(instance) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onConsentFormLoadFailure",
                    "error": formError.localizedDescription
                  ])
    }
    
    func onConsentFormDismissed(_ formError: Error, _ instance: BIDMADGDPRforGoogle) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(instance) })
            .first?
            .key else {
            return
        }
        
        sendEvent(withName: Self.eventName,
                  body: [
                    "instanceId": instanceId,
                    "action": "onConsentFormDismissed",
                    "error": formError.localizedDescription
                  ])
    }
}

protocol BIDMADGDPRforGoogleProtocolIdentifiable {
    func onConsentInfoUpdateSuccess(_ instance: BIDMADGDPRforGoogle)
    func onConsentInfoUpdateFailure(_ formError: Error, _ instance: BIDMADGDPRforGoogle)
    func onConsentFormLoadSuccess(_ instance: BIDMADGDPRforGoogle)
    func onConsentFormLoadFailure(_ formError: Error, _ instance: BIDMADGDPRforGoogle)
    func onConsentFormDismissed(_ formError: Error, _ instance: BIDMADGDPRforGoogle)
}

extension BIDMADGDPRforGoogle: BIDMADGDPRforGoogleProtocol {
    public func onConsentInfoUpdateSuccess() {
        BidmadPluginGDPRModule.shared?.onConsentInfoUpdateSuccess(self)
    }
    
    public func onConsentInfoUpdateFailure(_ formError: Error) {
        BidmadPluginGDPRModule.shared?.onConsentInfoUpdateFailure(formError, self)
    }
    
    public func onConsentFormLoadSuccess() {
        BidmadPluginGDPRModule.shared?.onConsentFormLoadSuccess(self)
    }
    
    public func onConsentFormLoadFailure(_ formError: Error) {
        BidmadPluginGDPRModule.shared?.onConsentFormLoadFailure(formError, self)
    }
    
    public func onConsentFormDismissed(_ formError: Error) {
        BidmadPluginGDPRModule.shared?.onConsentFormDismissed(formError, self)
    }
}
