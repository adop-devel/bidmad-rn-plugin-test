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

class BidmadPluginTestView : UIView {
    
    lazy var associatedBannerAd: BidmadBannerAd = {
        BidmadBannerAd(self.window!.rootViewController!, containerView: self, zoneID: "1c3e3085-333f-45af-8427-2810c26a72fc")
    }()
    
    @objc var color: String = "" {
        didSet {
            self.backgroundColor = hexStringToUIColor(hexColor: color)
        }
    }
    
    override func draw(_ rect: CGRect) {
        super.draw(rect)
        
        BidmadCommon.initializeSdk(withAppKey: "6b097551-7f78-11ed-a117-026864a21938")
        associatedBannerAd.load()
    }
    
    func hexStringToUIColor(hexColor: String) -> UIColor {
        let stringScanner = Scanner(string: hexColor)
        
        if(hexColor.hasPrefix("#")) {
            stringScanner.scanLocation = 1
        }
        var color: UInt32 = 0
        stringScanner.scanHexInt32(&color)
        
        let r = CGFloat(Int(color >> 16) & 0x000000FF)
        let g = CGFloat(Int(color >> 8) & 0x000000FF)
        let b = CGFloat(Int(color) & 0x000000FF)
        
        return UIColor(red: r / 255.0, green: g / 255.0, blue: b / 255.0, alpha: 1)
    }
}
