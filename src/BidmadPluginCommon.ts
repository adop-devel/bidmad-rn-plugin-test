export enum BidmadTrackingAuthorizationStatus {
    NotDetermined = 0,
    Restricted,
    Denied,
    Authorized,
    LessThaniOS14,
}

type BidmadPluginCommonType = {
    reqAdTrackingAuthorization(): Promise<BidmadTrackingAuthorizationStatus>;
    initializeSdk(appKey: string): Promise<boolean>;
};

const { BidmadPluginCommon } = require('react-native').NativeModules;

export default BidmadPluginCommon as BidmadPluginCommonType;