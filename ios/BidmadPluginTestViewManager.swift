import OpenBiddingHelper

@objc(BidmadPluginTestViewManager)
class BidmadPluginTestViewManager: RCTViewManager {
    
    override func view() -> (BidmadPluginTestView) {
        return BidmadPluginTestView()
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
}

@objcMembers
class BidmadPluginTestView : UIView, BIDMADOpenBiddingBannerDelegate {
    
    var iOSZoneId: String?
    var androidZoneId: String?
    
    var onLoad: RCTDirectEventBlock?
    var onLoadFail: RCTDirectEventBlock?
    var onClick: RCTDirectEventBlock?
    
    lazy var associatedBannerAd: BidmadBannerAd = {
        let ad = BidmadBannerAd(self.window!.rootViewController!, containerView: self, zoneID: iOSZoneId!)
        ad.delegate = self
        return ad
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        self.backgroundColor = .clear
        
        DispatchQueue.main.async { [weak self] in
            Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] timer in
                guard let self = self else {
                    timer.invalidate()
                    return
                }
                
                guard let window = self.window,
                      let _ = window.rootViewController,
                      let _ = self.iOSZoneId else {
                    return
                }
                
                self.associatedBannerAd.load()
                timer.invalidate()
            }
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func onLoadAd(_ bidmadAd: OpenBiddingBanner) {
        onLoad?([String: Any]())
    }
    
    func onClickAd(_ bidmadAd: OpenBiddingBanner) {
        onClick?([String: Any]())
    }
    
    func onLoadFailAd(_ bidmadAd: OpenBiddingBanner, error: Error) {
        onLoadFail?([String: Any]())
    }
    
    deinit {
        print("I am being deallocated!")
    }
}
