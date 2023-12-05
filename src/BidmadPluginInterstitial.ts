type BidmadPluginInterstitialType = {
    createInstance(iOSZoneId: string, androidZoneId: string): Promise<number>;
    disposeInstance(instanceId: number): void;
    load(instanceId: number): Promise<void>;
    show(instanceId: number): Promise<void>;
};

const { BidmadPluginInterstitialModule } = require('react-native').NativeModules;

export default BidmadPluginInterstitialModule as BidmadPluginInterstitialType;

type LoadCallback = () => void;
type LoadFailCallback = (error: Error) => void;
type ShowCallback = () => void;
type ClickCallback = () => void;
type CloseCallback = () => void;

class BidmadPluginInterstitial {
    instanceId: number;
    private onLoadCallback?: LoadCallback;
    private onLoadFailCallback?: LoadFailCallback;
    private onShowCallback?: ShowCallback;
    private onClickCallback?: ClickCallback;
    private onCloseCallback?: CloseCallback;

    constructor(instanceId: number) {
        this.instanceId = instanceId;
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

    dispose() {
        BidmadPluginInterstitialModule.disposeInstance(this.instanceId);
    }
}