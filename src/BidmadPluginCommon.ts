export enum BidmadTrackingAuthorizationStatus {
    NotDetermined = 0,
    Restricted,
    Denied,
    Authorized,
    LessThaniOS14,
}

type BidmadPluginCommonType = {
    reqAdTrackingAuthorization(): Promise<BidmadTrackingAuthorizationStatus>;
    initializeSdk(iOSAppKey: string, androidAppKey: string): Promise<boolean>;
    setAdvertiserTracking(enable: boolean): void;
    advertiserTracking(): Promise<boolean>;
    setIsChildDirectedAds(isChildDirectedAds: boolean): void;
    isChildDirectedTreatment(): Promise<boolean | null>;
    setUserConsentCCPA(userConsentCCPA: boolean): void;
    isUserConsentCCPA(): Promise<boolean | null>;
    setIsDebug(isDebug: boolean): void;
    isDebug(): Promise<boolean>;
    setTestDeviceId(testDeviceId: string): void;
    testDeviceId(): Promise<string | null>;
    setCuid(cuid: string): void;
    cuid(): Promise<string | null>;
    setUseServerSideCallback(useServerSideCallback: boolean): void;
    useServerSideCallback(): Promise<boolean>;
};

const { BidmadPluginCommon } = require('react-native').NativeModules;

export default BidmadPluginCommon as BidmadPluginCommonType;