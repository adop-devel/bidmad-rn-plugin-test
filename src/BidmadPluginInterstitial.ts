import { NativeEventEmitter, NativeModules } from 'react-native';

const { BidmadPluginInterstitialModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(BidmadPluginInterstitialModule);

interface BidmadPluginInterstitialCallbacks {
    onLoad?: () => void;
    onLoadFail?: (error: string) => void;
    onShow?: () => void;
    onClick?: () => void;
    onClose?: () => void;
}

class BidmadPluginInterstitial {
    instanceId: string;
    private callbacks?: BidmadPluginInterstitialCallbacks;

    constructor(instanceId: string) {
        this.instanceId = instanceId;
        
        eventEmitter.addListener('AdEvents', (event: any) => {
            if (event.instanceId == this.instanceId) {
                switch (event.action) {
                    case 'onLoad':
                        this.callbacks?.onLoad?.();
                        break;
                    case 'onLoadFail':
                        this.callbacks?.onLoadFail?.(event.error);
                        break;
                    case 'onShow':
                        this.callbacks?.onShow?.();
                        break;
                    case 'onClick':
                        this.callbacks?.onClick?.();
                        break;
                    case 'onClose':
                        this.callbacks?.onClose?.();
                        break;
                }
            }
        })
    }

    static async create(iOSZoneId: string, androidZoneId: string) {
        const instanceId = await BidmadPluginInterstitialModule.createInstance(iOSZoneId, androidZoneId);
        return new BidmadPluginInterstitial(instanceId);
    }

    async load() {
        await BidmadPluginInterstitialModule.load(this.instanceId);
    }

    async show() {
        await BidmadPluginInterstitialModule.show(this.instanceId);
    }

    setCallbacks(callbacks: BidmadPluginInterstitialCallbacks) {
        this.callbacks = callbacks;
    }

    dispose() {
        BidmadPluginInterstitialModule.disposeInstance(this.instanceId);
    }
}

export default BidmadPluginInterstitial;