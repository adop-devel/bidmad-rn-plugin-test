import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

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
        console.log("constructor");
        eventEmitter.addListener('BidmadInterstitialCallback', (event: any) => {
            if (event.instanceId == this.instanceId) {
                switch (event.action) {
                    case 'onInterstitialLoad':
                        this.callbacks?.onLoad?.();
                        break;
                    case 'onInterstitialLoadFail':
                        this.callbacks?.onLoadFail?.(event.error);
                        break;
                    case 'onInterstitialShow':
                        this.callbacks?.onShow?.();
                        break;
                    case 'onInterstitialClose':
                        this.callbacks?.onClose?.();
                        break;
                }
            }
        })
    }

    static async create(iOSZoneId: string, androidZoneId: string) {
        let ad: BidmadPluginInterstitial | null = null;

        if (Platform.OS === 'android') {
            const instanceId = await BidmadPluginInterstitialModule.createInstance(androidZoneId);
            console.log("instanceId : ",instanceId);
            ad = new BidmadPluginInterstitial(instanceId);
        } else if (Platform.OS == 'ios') {
            const instanceId = await BidmadPluginInterstitialModule.createInstance(iOSZoneId);
            ad = new BidmadPluginInterstitial(instanceId);
        }

        console.log(ad);

        return ad;
    }

    async load() {
        await BidmadPluginInterstitialModule.load(this.instanceId);
    }

    async show() {
        await BidmadPluginInterstitialModule.show(this.instanceId);
    }

    async isLoaded(): Promise<boolean> {
        const loadStatus = await BidmadPluginInterstitialModule.isLoaded(this.instanceId);
        return loadStatus;
    }

    setCallbacks(callbacks: BidmadPluginInterstitialCallbacks) {
        this.callbacks = callbacks;
    }

    dispose() {
        BidmadPluginInterstitialModule.disposeInstance(this.instanceId);
    }
}

export default BidmadPluginInterstitial;