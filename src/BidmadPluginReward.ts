import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { BidmadPluginRewardModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(BidmadPluginRewardModule);

interface BidmadPluginRewardCallbacks {
    onLoad?: () => void;
    onLoadFail?: (error: string) => void;
    onShow?: () => void;
    onComplete?: () => void;
    onClick?: () => void;
    onClose?: () => void;
}

class BidmadPluginReward {
    instanceId: string;
    private callbacks?: BidmadPluginRewardCallbacks;

    constructor(instanceId: string) {
        this.instanceId = instanceId;
        
        eventEmitter.addListener('BidmadRewardCallback', (event: any) => {
            if (event.instanceId === this.instanceId) {
                switch (event.action) {
                    case 'onRewardLoad':
                        this.callbacks?.onLoad?.();
                        break;
                    case 'onRewardLoadFail':
                        this.callbacks?.onLoadFail?.(event.error);
                        break;
                    case 'onRewardShow':
                        this.callbacks?.onShow?.();
                        break;
                    case 'onRewardComplete':
                        this.callbacks?.onComplete?.();
                        break;
                    case 'onRewardSkip':
                        this.callbacks?.onSkip?.();
                        break;
                    case 'onRewardClick':
                        this.callbacks?.onClick?.();
                        break;
                    case 'onRewardClose':
                        this.callbacks?.onClose?.();
                        break;
                }
            }
        })
    }

    static async create(iOSZoneId: string, androidZoneId: string): Promise<BidmadPluginReward | null> {
        let ad: BidmadPluginReward | null = null;

        if (Platform.OS === 'android') {
            const instanceId = await BidmadPluginRewardModule.createInstance(androidZoneId);
            ad = new BidmadPluginReward(instanceId);
        } else if (Platform.OS == 'ios') {
            const instanceId = await BidmadPluginRewardModule.createInstance(iOSZoneId);
            ad = new BidmadPluginReward(instanceId);
        }

        return ad;
    }

    async load() {
        await BidmadPluginRewardModule.load(this.instanceId);
    }

    async show() {
        await BidmadPluginRewardModule.show(this.instanceId);
    }

    async isLoaded(): Promise<boolean> {
        const loadStatus = await BidmadPluginRewardModule.isLoaded(this.instanceId);
        return loadStatus;
    }

    setCallbacks(callbacks: BidmadPluginRewardCallbacks) {
        this.callbacks = callbacks;
    }

    dispose() {
        BidmadPluginRewardModule.disposeInstance(this.instanceId);
    }
}

export default BidmadPluginReward;