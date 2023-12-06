import { NativeModules, Platform } from 'react-native';

export enum BidmadTrackingAuthorizationStatus {
    NotDetermined = 0,
    Restricted,
    Denied,
    Authorized,
    LessThaniOS14,
}

const { BidmadPluginCommonModule } = NativeModules; 

class BidmadPluginCommon {
    static async reqAdTrackingAuthorization(): Promise<BidmadTrackingAuthorizationStatus> {
        let permission = BidmadTrackingAuthorizationStatus.NotDetermined;

        if (Platform.OS === 'ios') {
            permission = await BidmadPluginCommonModule.reqAdTrackingAuthorization() as BidmadTrackingAuthorizationStatus;
        }

        return permission;
    }

    static async initializeSdk(iOSAppKey: string, androidAppKey: string): Promise<boolean> {
        let initStatus = false;
        
        if (Platform.OS === 'ios') {
            initStatus = await BidmadPluginCommonModule.initializeSdk(iOSAppKey);
        } else if (Platform.OS === 'android') {
            initStatus = await BidmadPluginCommonModule.initializeSdk(androidAppKey);
        }
        
        return initStatus;
    }

    static async setChildDirectedAds(isChildDirectedAds: boolean): Promise<void> {
        if (Platform.OS === 'ios') {
            initStatus = await BidmadPluginCommonModule.setIsChildDirectedAds(isChildDirectedAds);
        } else if (Platform.OS === 'android') {
            initStatus = await BidmadPluginCommonModule.setChildDirectedAds(isChildDirectedAds);
        }
    }

    static async isChildDirectedTreatment(): Promise<boolean | null> {
        let isChild = null;

        if (['ios', 'android'].includes(Platform.OS)) {
            isChild = await BidmadPluginCommonModule.isChildDirectedTreatment();
        }

        return isChild;
    }

    static async setDebug(isDebug: boolean): Promise<void> {
        if (Platform.OS === 'ios') {
            initStatus = await BidmadPluginCommonModule.setIsDebug(isDebug);
        } else if (Platform.OS === 'android') {
            initStatus = await BidmadPluginCommonModule.setDebug(isDebug);
        }
    }

    static async isDebug(): Promise<boolean> {
        let isDebug = false;

        if (['ios', 'android'].includes(Platform.OS)) {
            isDebug = await BidmadPluginCommonModule.isDebug();
        }

        return isDebug;
    }

    static async setTestDeviceId(testDeviceId: string): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setTestDeviceId(testDeviceId);
        }
    }

    static async getTestDeviceId(): Promise<string | null> {
        let id = null;

        if (Platform.OS === 'ios') {
            initStatus = await BidmadPluginCommonModule.testDeviceId();
        } else if (Platform.OS === 'android') {
            initStatus = await BidmadPluginCommonModule.getTestDeviceId();
        }

        return id;
    }
    static async setCuid(cuid: string): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setCuid(cuid);
        }
    }

    static async getCuid(): Promise<string | null> {
        let cuid = null;

        if (Platform.OS === 'ios') {
            initStatus = await BidmadPluginCommonModule.cuid();
        } else if (Platform.OS === 'android') {
            initStatus = await BidmadPluginCommonModule.getCuid();
        }

        return cuid;
    }

    static async setUseServerSideCallback(useServerSideCallback: boolean): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setUseServerSideCallback(useServerSideCallback);
        }
    }

    static async getUseServerSideCallback(): Promise<boolean> {
        let useSSC = false;

        if (Platform.OS === 'ios') {
            initStatus = await BidmadPluginCommonModule.useServerSideCallback();
        } else if (Platform.OS === 'android') {
            initStatus = await BidmadPluginCommonModule.getUseServerSideCallback();
        }

        return useSSC;
    }
}

export default BidmadPluginCommon;