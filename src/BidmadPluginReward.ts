import { NativeEventEmitter, NativeModules } from 'react-native';

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
        
        eventEmitter.addListener('AdEvents', (event: any) => {
            if (event.instanceId == this.instanceId) {
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

    static async create(iOSZoneId: string, androidZoneId: string) {
        const instanceId = await BidmadPluginRewardModule.createInstance(iOSZoneId, androidZoneId);
        return new BidmadPluginReward(instanceId);
    }

    async load() {
        await BidmadPluginRewardModule.load(this.instanceId);
    }

    async show() {
        await BidmadPluginRewardModule.show(this.instanceId);
    }

    setCallbacks(callbacks: BidmadPluginRewardCallbacks) {
        this.callbacks = callbacks;
    }

    dispose() {
        BidmadPluginRewardModule.disposeInstance(this.instanceId);
    }
}

export default BidmadPluginReward;