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
    
    override init() {
        super.init()
        Self.shared = self
    }

    func createInstance(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let instanceId = UUID().uuidString;
            Self.instances[instanceId] = BIDMADGDPRforGoogle(UIViewController())
            Self.instances[instanceId]!.perform(NSSelectorFromString("setConsentStatusDelegate:"), with:Self.instances[instanceId]!)
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
    
    func loadForm(instanceId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            Self.instances[instanceId]?.loadForm()
            resolve(nil)
        }
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
    
    func onConsentFormDismissed(_ formError: Error!, _ instance: BIDMADGDPRforGoogle) {
        guard let instanceId = Self.instances
            .filter({ $0.value.isEqual(instance) })
            .first?
            .key else {
            return
        }
        
        if let errorReason = formError?.localizedDescription {
            sendEvent(withName: Self.eventName,
                      body: [
                        "instanceId": instanceId,
                        "action": "onConsentFormDismissed",
                        "error": errorReason
                      ])
        } else {
            sendEvent(withName: Self.eventName,
                      body: [
                        "instanceId": instanceId,
                        "action": "onConsentFormDismissed"
                      ])
        }
    }
}

protocol BIDMADGDPRforGoogleProtocolIdentifiable {
    func onConsentInfoUpdateSuccess(_ instance: BIDMADGDPRforGoogle)
    func onConsentInfoUpdateFailure(_ formError: Error, _ instance: BIDMADGDPRforGoogle)
    func onConsentFormLoadSuccess(_ instance: BIDMADGDPRforGoogle)
    func onConsentFormLoadFailure(_ formError: Error, _ instance: BIDMADGDPRforGoogle)
    func onConsentFormDismissed(_ formError: Error!, _ instance: BIDMADGDPRforGoogle)
}

extension BIDMADGDPRforGoogle {
    @objc public func onConsentInfoUpdateSuccess() {
        BidmadPluginGDPRModule.shared?.onConsentInfoUpdateSuccess(self)
    }
    
    @objc public func onConsentInfoUpdateFailure(_ formError: Error) {
        BidmadPluginGDPRModule.shared?.onConsentInfoUpdateFailure(formError, self)
    }
    
    @objc public func onConsentFormLoadSuccess() {
        BidmadPluginGDPRModule.shared?.onConsentFormLoadSuccess(self)
    }
    
    @objc public func onConsentFormLoadFailure(_ formError: Error) {
        BidmadPluginGDPRModule.shared?.onConsentFormLoadFailure(formError, self)
    }
    
    @objc public func onConsentFormDismissed(_ formError: Error!) {
        BidmadPluginGDPRModule.shared?.onConsentFormDismissed(formError, self)
        
        DispatchQueue.main.async { [weak self] in
            self?.parentViewController = UIViewController()
        }
    }
}
