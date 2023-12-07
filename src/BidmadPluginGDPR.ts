import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { BidmadPluginGDPRModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(BidmadPluginGDPRModule);

export enum BidmadUMPStatus {
    Unknown = 0,
    Required = 1,
    NotRequired = 2,
    Obtained = 3,
}

interface BidmadPluginGDPRCallbacks {
    onConsentInfoUpdateSuccess?: () => void;
    onConsentInfoUpdateFailure?: (formError: string) => void;
    onConsentFormLoadSuccess?: () => void;
    onConsentFormLoadFailure?: (formError: string) => void;
    onConsentFormDismissed?: (formError: string|null) => void;
}

class BidmadPluginGDPR {
    instanceId: string;
    private callbacks?: BidmadPluginGDPRCallbacks;

    constructor(instanceId: string) {
        this.instanceId = instanceId;

        eventEmitter.addListener('BidmadGDPRCallback', (event: any) => {
            if (event.instanceId === this.instanceId) {
                switch (event.action) {
                    case 'onConsentInfoUpdateSuccess':
                        this.callbacks?.onConsentInfoUpdateSuccess?.();
                        break;
                    case 'onConsentInfoUpdateFailure':
                        this.callbacks?.onConsentInfoUpdateFailure?.(event.error);
                        break;
                    case 'onConsentFormLoadSuccess':
                        this.callbacks?.onConsentFormLoadSuccess?.();
                        break;
                    case 'onConsentFormLoadFailure':
                        this.callbacks?.onConsentFormLoadFailure?.(event.error);
                        break;
                    case 'onConsentFormDismissed':
                        this.callbacks?.onConsentFormDismissed?.(event.error);
                        break;
                }
            }
        });
    }

    static async create(): Promise<BidmadPluginGDPR | null> {
        let ad: BidmadPluginGDPR | null = null;

        if (['android', 'ios'].includes(Platform.OS)) {
            const instanceId = await BidmadPluginGDPRModule.createInstance();
            ad = new BidmadPluginGDPR(instanceId);
        }

        return ad;
    }

    setCallbacks(callbacks: BidmadPluginGDPRCallbacks) {
        this.callbacks = callbacks;
    }

    async setDebug(testDeviceId: string, isEEA: boolean) {
        await BidmadPluginGDPRModule.setDebug(testDeviceId, isEEA);
    }

    async requestConsentInfoUpdate() {
        await BidmadPluginGDPRModule.requestConsentInfoUpdate();
    }

    async isConsentFormAvailable(): Promise<boolean> {
        const isAvailable = await BidmadPluginGDPRModule.isConsentFormAvailable();
        return isAvailable;
    }

    async loadForm() {
        await BidmadPluginGDPRModule.loadForm();
    }

    async getConsentStatus(): Promise<BidmadUMPStatus> {
        const status = BidmadPluginGDPRModule.getConsentStatus();
        return status;
    }

    async reset() {
        await BidmadPluginGDPRModule.reset();
    }

    async showForm() {
        await BidmadPluginGDPRModule.showForm();
    }
}

export default BidmadPluginGDPR;