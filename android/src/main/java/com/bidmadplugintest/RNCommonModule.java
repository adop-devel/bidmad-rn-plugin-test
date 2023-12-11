package com.bidmadplugintest;

import com.adop.sdk.AdOption;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import ad.helper.openbidding.BidmadCommon;
import ad.helper.openbidding.initialize.BidmadInitializeListener;

public class RNCommonModule extends ReactContextBaseJavaModule {
    static ReactApplicationContext mReactContext;

    public RNCommonModule(ReactApplicationContext reactContext) {
        mReactContext = reactContext;
    }

    @Override
    public String getName(){
        return "BidmadPluginCommonModule";
    }

    @ReactMethod
    public void initializeSdk(String appkey, Promise promise){
        if(mReactContext != null) {
            BidmadCommon.initializeSdk(mReactContext, appkey, new BidmadInitializeListener() {
                @Override
                public void onInitialized(boolean result) {
                    promise.resolve(result);
                }
            });
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void setChildDirectedAds(boolean isChildDirectedAds, Promise promise){
        AdOption.getInstance().setChildDirected(isChildDirectedAds);
        promise.resolve(null);
    }

    @ReactMethod
    public void isChildDirectedTreatment(Promise promise){
        promise.resolve(AdOption.getInstance().isChildDirected());
    }

    @ReactMethod
    public void setDebug(boolean isDebug, Promise promise){
        BidmadCommon.setDebugging(isDebug);
        promise.resolve(null);
    }

    @ReactMethod
    public void isDebug(Promise promise){
        promise.resolve(BidmadCommon.isDebug());
    }

    @ReactMethod
    public void setTestDeviceId(String testDeviceId, Promise promise){
        BidmadCommon.setGgTestDeviceid(testDeviceId);
        promise.resolve(null);
    }

    @ReactMethod
    public void getTestDeviceId(Promise promise){
        promise.resolve(BidmadCommon.getGgTestDeviceid());
    }

    @ReactMethod
    public void setCuid(String cuid, Promise promise){
        AdOption.getInstance().setCuid(cuid);
        promise.resolve(null);
    }

    @ReactMethod
    public void getCuid(Promise promise){
        promise.resolve(AdOption.getInstance().getCuid());
    }

    @ReactMethod
    public void setUseServerSideCallback(boolean useServerSideCallback, Promise promise){
        AdOption.getInstance().setUseServerSideCallback(useServerSideCallback);
        promise.resolve(null);
    }

    @ReactMethod
    public void getUseServerSideCallback(Promise promise){
        promise.resolve(AdOption.getInstance().getUseServerSideCallback());
    }
}
