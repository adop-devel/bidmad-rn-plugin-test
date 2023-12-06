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
    public void setChildDirectedAds(boolean isChildDirectedAds){
        AdOption.getInstance().setChildDirected(isChildDirectedAds);
    }

    @ReactMethod
    public boolean isChildDirectedTreatment(){
        return AdOption.getInstance().isChildDirected();
    }

    @ReactMethod
    public void setDebug(boolean isDebug){
        BidmadCommon.setDebugging(isDebug);
    }

    @ReactMethod
    public boolean isDebug(){
        return false; //추후 BidmadCommon에 추가
    }

    @ReactMethod
    public void setTestDeviceId(String testDeviceId){
        BidmadCommon.setGgTestDeviceid(testDeviceId);
    }

    @ReactMethod
    public String getTestDeviceId(){
        return BidmadCommon.getGgTestDeviceid();
    }

    @ReactMethod
    public void setCuid(String cuid){
        AdOption.getInstance().setCuid(cuid);
    }

    @ReactMethod
    public String getCuid(){
        return AdOption.getInstance().getCuid();
    }

    @ReactMethod
    public void setUseServerSideCallback(boolean useServerSideCallback){
        AdOption.getInstance().setUseServerSideCallback(useServerSideCallback);
    }

    @ReactMethod
    public boolean getUseServerSideCallback(){
        return AdOption.getInstance().getUseServerSideCallback();
    }
}
