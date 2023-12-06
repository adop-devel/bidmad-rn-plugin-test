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

        if (Platform.OS == 'ios') {
            permission = await BidmadPluginCommonModule.reqAdTrackingAuthorization() as BidmadTrackingAuthorizationStatus;
        }

        return permission;
    }

    static async initializeSdk(iOSAppKey: string, androidAppKey: string): Promise<boolean> {
        let initStatus = false;
        
        if (Platform.OS == 'ios') {
            initStatus = await BidmadPluginCommonModule.initializeSdk(iOSAppKey);
        } else if (Platform.OS == 'android') {
            initStatus = await BidmadPluginCommonModule.initializeSdk(androidAppKey);
        }
        
        return initStatus;
    }

    static async setAdvertiserTracking(enable: boolean): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setAdvertiserTracking(enable);
        }
    }

    static async advertiserTracking(): Promise<boolean> {
        let adTracking = false;

        if (['ios', 'android'].includes(Platform.OS)) {
            adTracking = await BidmadPluginCommonModule.advertiserTracking();
        }

        return adTracking;
    }

    static async setIsChildDirectedAds(isChildDirectedAds: boolean): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setIsChildDirectedAds(isChildDirectedAds);
        }
    }

    static async isChildDirectedTreatment(): Promise<boolean | null> {
        let isChild = null;

        if (['ios', 'android'].includes(Platform.OS)) {
            isChild = await BidmadPluginCommonModule.isChildDirectedTreatment();
        }

        return isChild;
    }

    static async setUserConsentCCPA(userConsentCCPA: boolean): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setUserConsentCCPA(userConsentCCPA);
        }
    }
    
    static async isUserConsentCCPA(): Promise<boolean | null> {
        let consentCCPA = null;

        if (['ios', 'android'].includes(Platform.OS)) {
            consentCCPA = await BidmadPluginCommonModule.isUserConsentCCPA();
        }

        return consentCCPA;
    }

    static async setIsDebug(isDebug: boolean): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setIsDebug(isDebug);
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

    static async testDeviceId(): Promise<string | null> {
        let id = null;

        if (['ios', 'android'].includes(Platform.OS)) {
            id = await BidmadPluginCommonModule.testDeviceId();
        }

        return id;
    }
    static async setCuid(cuid: string): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setCuid(cuid);
        }
    }

    static async cuid(): Promise<string | null> {
        let cuid = null;

        if (['ios', 'android'].includes(Platform.OS)) {
            cuid = await BidmadPluginCommonModule.cuid();
        }

        return cuid;
    }

    static async setUseServerSideCallback(useServerSideCallback: boolean): Promise<void> {
        if (['ios', 'android'].includes(Platform.OS)) {
            await BidmadPluginCommonModule.setUseServerSideCallback(useServerSideCallback);
        }
    }

    static async useServerSideCallback(): Promise<boolean> {
        let useSSC = false;

        if (['ios', 'android'].includes(Platform.OS)) {
            useSSC = await BidmadPluginCommonModule.useServerSideCallback();
        }

        return useSSC;
    }
}

export default BidmadPluginCommon;